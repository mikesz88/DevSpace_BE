import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import db from '../../prisma/db.setup';
import {
  saltValue,
  matchSaltedValue,
  sendTokenResponse,
  extractUsername,
  getRandomHexColor,
  isHexColor,
} from '../utils/auth';
import {
  AddOrRemoveFriendType,
  FriendsUsernameType,
  LoginUserType,
  MyTop8FriendsType,
  RegisterUserType,
  UpdatePartOneType,
  UpdatePartTwoType,
} from '../zodTypes/auth.types';

// * @desc Login
// * @route POST /api/v1/auth/login
// * @access PUBLIC
exports.login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password }: LoginUserType = req.body;

    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email and/or Password is incorrect.',
      });
    }

    const userHashedPassword = await db.password.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        password: true,
      },
    });

    const isMatch = await matchSaltedValue(
      password,
      userHashedPassword!.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email and/or Password is incorrect.',
      });
    }

    sendTokenResponse(user.id, 200, res);
  }
);

// * @route GET /api/v1/auth/me
// * @access PRIVATE
exports.getLoggedInUser = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await db.user.findUnique({
      where: { id: req.currentUser!.id },
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// * @desc Register User
// * @route POST /api/v1/auth/register
// * @access PUBLIC
exports.register = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email }: RegisterUserType = req.body;

    const checkEmail = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.status(401).json({
        success: false,
        message: 'Email is already registered.',
      });
    }

    const username = extractUsername(email);

    if (!username) {
      return res.status(401).json({
        success: false,
        message: 'Email is not valid',
      });
    }

    const user = await db.user.create({
      data: {
        email,
        username,
      },
    });

    sendTokenResponse(user.id, 201, res);
  }
);

// * @desc GET random color
// * @route GET /api/v1/auth/randomColor
// * @access PUBLIC
exports.randomColor = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const randomColor = getRandomHexColor();

    res.status(200).json({
      success: true,
      data: randomColor,
    });
  }
);

// * @desc GET random Avatar
// * @route GET /api/v1/auth/randomAvatar
// * @access PUBLIC
exports.randomAvatar = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const allAvatars = await db.avatar.findMany();

    const randomAvatar =
      allAvatars[Math.floor(Math.random() * allAvatars.length)];

    res.status(200).json({
      success: true,
      data: randomAvatar.avatarURL,
    });
  }
);

// * @desc Update Profile part one
// * @route PATCH /api/v1/auth/updatePartOne
// * @access PRIVATE
exports.updatePartOne = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const {
      firstName,
      lastName,
      username,
      jobTitle,
      password,
      confirmPassword,
    }: UpdatePartOneType = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'The password and Confirm password do not match.',
      });
    }

    const allUsernames = await db.user.findMany({ select: { username: true } });

    const isInvalidUsername = allUsernames.some(
      (obj) => obj.username.toLowerCase() === username.toLowerCase()
    );

    if (isInvalidUsername) {
      return res.status(400).json({
        success: false,
        message:
          'The username is already taken by someone else. Try another one.',
      });
    }

    await db.user.update({
      where: {
        id: req.currentUser!.id,
      },
      data: {
        firstName,
        lastName,
        username,
        jobTitle,
      },
    });

    const alreadyHavePassword = await db.password.findUnique({
      where: { userId: req.currentUser!.id },
    });

    if (alreadyHavePassword) {
      await db.password.update({
        where: { userId: req.currentUser!.id },
        data: { password: await saltValue(password) },
      });
    } else {
      await db.password.create({
        data: {
          userId: req.currentUser!.id,
          password: await saltValue(password),
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'User has been updated',
    });
  }
);

// * @desc Update Profile part two
// * @route PATCH /api/v1/auth/updatePartTwo
// * @access PRIVATE
exports.updatePartTwo = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const {
      backgroundColor,
      complimentingColor,
      favSlogan,
      favMusic,
      avatar,
      biography,
    }: UpdatePartTwoType = req.body;

    const chosenAvatar = await db.avatar.findFirst({
      where: { avatarURL: avatar },
    });

    if (!chosenAvatar) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Avatar URL.',
      });
    }

    if (!isHexColor(backgroundColor) || !isHexColor(complimentingColor)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Hex Color Code. Please try again.',
      });
    }

    await db.user.update({
      where: { id: req.currentUser!.id },
      data: {
        backgroundColor,
        complimentingColor,
        favSlogan: favSlogan || 'I chose to be lazy and not write one.',
        favMusic: favMusic || 'I chose to be lazy and not write one.',
        avatarId: chosenAvatar.id,
        biography: biography || 'I chose to be lazy and not write one.',
      },
    });

    res.status(200).json({
      success: true,
      message: 'User has been updated',
    });
  }
);

// * @desc List of Available Friends
// * @route GET /api/v1/auth/availableFriends
// * @access PRIVATE
exports.availableFriends = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const myCurrentFriends = await db.user.findUnique({
      where: { id: req.currentUser!.id },
      select: { friendIds: true },
    });
    const myIdAndCurrentFriendsIdsOnly = myCurrentFriends!.friendIds;
    myIdAndCurrentFriendsIdsOnly.push(req.currentUser!.id);

    const allUsers = (await db.user.findMany({ select: { id: true } })).map(
      (user) => user.id
    );

    const eligibleFriends = allUsers.filter(
      (potentialFriendId) =>
        !myIdAndCurrentFriendsIdsOnly.includes(potentialFriendId)
    );

    res.status(200).json({ success: true, data: eligibleFriends });
  }
);

// * @desc Friends Count
// * @route GET /api/v1/auth/myFriendCount
// * @access PRIVATE
exports.myFriendCount = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const myFriends = await db.user.findUnique({
      where: { id: req.currentUser!.id },
      select: { friendIds: true },
    });
    const myFriendsCount = myFriends!.friendIds.length;

    res.status(200).json({ success: true, data: myFriendsCount });
  }
);

// * @desc All my friends Usernames
// * @route GET /api/v1/auth/myFriendsUsernames
// * @access PRIVATE
exports.addFriend = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const myFriends = await db.user.findUnique({
      where: { id: req.currentUser!.id },
      select: { friendIds: true },
    });

    const myFriendsIds = myFriends!.friendIds;

    const friendQueries = myFriendsIds.map(async (friendId) => {
      const friend = await db.user.findUnique({
        where: { id: friendId },
        select: { username: true },
      });
      return friend!.username;
    });

    const friendsUsernames = await Promise.all(friendQueries);

    res.status(200).json({ success: true, data: friendsUsernames });
  }
);

// * @desc Add Friend
// * @route PATCH /api/v1/auth/addFriends
// * @access PRIVATE
exports.addFriends = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { friendUsernames }: AddOrRemoveFriendType = req.body;

    const friendQueries = friendUsernames.map(async (friendUsername) => {
      const friend = await db.user.findUnique({
        where: { username: friendUsername },
        select: { id: true },
      });
      return friend!.id;
    });

    const newFriendsIds = await Promise.all(friendQueries);

    const myCurrentFriends = await db.user.findUnique({
      where: { id: req.currentUser!.id },
      select: { friendIds: true },
    });

    const myCurrentFriendsId = myCurrentFriends!.friendIds;

    const combinedArrayOfOldAndNewFriendsIds = [
      ...myCurrentFriendsId,
      ...newFriendsIds,
    ];

    await db.user.update({
      where: { id: req.currentUser!.id },
      data: { friendIds: combinedArrayOfOldAndNewFriendsIds },
    });

    res.status(200).json({ success: true, message: 'Friend list updated.' });
  }
);

// * @desc Remove Friend
// * @route PATCH /api/v1/auth/removeFriends
// * @access PRIVATE
exports.removeFriends = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { friendUsernames }: AddOrRemoveFriendType = req.body;

    const friendQueries = friendUsernames.map(async (friendUsername) => {
      const friend = await db.user.findUnique({
        where: { username: friendUsername },
        select: { id: true },
      });
      return friend!.id;
    });

    const removingFriendsIds = await Promise.all(friendQueries);

    const myCurrentFriends = await db.user.findUnique({
      where: { id: req.currentUser!.id },
      select: { friendIds: true },
    });

    const myCurrentFriendsId = myCurrentFriends!.friendIds;

    const myUpdatedFriendList = myCurrentFriendsId.filter(
      (friendId) => !removingFriendsIds.includes(friendId)
    );

    await db.user.update({
      where: { id: req.currentUser!.id },
      data: { friendIds: myUpdatedFriendList },
    });

    res.status(200).json({ success: true, message: 'Friend list updated.' });
  }
);

// * @desc My current Top 8 Friends
// * @route GET /api/v1/auth/myTopEightFriends
// * @access PRIVATE
exports.myTopEightFriends = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const myTopEightFriends = await db.user.findUnique({
      where: { id: req.currentUser!.id },
      select: { topEight: true },
    });

    const myTopEightFriendsIds = myTopEightFriends!.topEight;

    const friendQueries = myTopEightFriendsIds.map(async (friendId) => {
      const friend = await db.user.findUnique({
        where: { id: friendId },
        select: { username: true, avatar: { select: { avatarURL: true } } },
      });
      return friend!;
    });

    const myTop8FriendsUsernames = (await Promise.all(friendQueries)).map(
      (friend) => ({
        username: friend.username,
        avatarURL: friend.avatar!.avatarURL,
      })
    );

    res.status(200).json({ success: true, data: myTop8FriendsUsernames });
  }
);

// * @desc Create My Top 8 Friends
// * @route PATCH /api/v1/auth/createTop8Friends
// * @access PRIVATE
exports.createTop8Friends = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { myChosenFriendsUsernames }: MyTop8FriendsType = req.body;

    const friendQueries = myChosenFriendsUsernames.map(
      async (friendUsername) => {
        const friend = await db.user.findUnique({
          where: { username: friendUsername },
          select: { id: true },
        });
        return friend!.id;
      }
    );

    const myTop8FriendsIds = await Promise.all(friendQueries);

    await db.user.update({
      where: { id: req.currentUser!.id },
      data: { topEight: myTop8FriendsIds },
    });

    res
      .status(200)
      .json({ success: true, message: 'Top 8 Friends, completed.' });
  }
);

// * @desc Delete Profile
// * @route DELETE /api/v1/auth/deleteMe
// * @access PRIVATE
exports.deleteMe = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const usersWhoFriendedMe = await db.user.findMany({
      where: {
        friendIds: {
          has: req.currentUser!.id,
        },
      },
    });

    const usersWhoTop8Me = await db.user.findMany({
      where: {
        topEight: {
          has: req.currentUser!.id,
        },
      },
    });

    const usersToUpdate = [...usersWhoFriendedMe, ...usersWhoTop8Me];

    if (usersToUpdate.length === 0) {
      await db.user.delete({ where: { id: req.currentUser!.id } });
      return res.status(200).json({ success: true, message: 'User Deleted.' });
    }

    const updatePromises = usersToUpdate.map(async (user) => {
      const updatedFriendIds = user.friendIds.filter(
        (id) => id !== req.currentUser!.id
      );
      const updatedTopEight = user.topEight.filter(
        (id) => id !== req.currentUser!.id
      );

      await db.user.update({
        where: { id: user.id },
        data: {
          friendIds: updatedFriendIds,
          topEight: updatedTopEight,
        },
      });
    });

    await Promise.all(updatePromises);

    await db.user.delete({ where: { id: req.currentUser!.id } });
    res.status(200).json({ success: true, message: 'User Deleted.' });
  }
);

// * @desc Friends Profile
// * @route GET /api/v1/auth/friendsProfile/:username
// * @access PRIVATE
exports.friendsProfile = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const username: string = req.params.username;

    const friendsProfile = await db.user.findUnique({
      where: { username },
      include: { avatar: { select: { avatarURL: true } } },
    });

    const modifiedUser = {
      ...friendsProfile,
      avatar: friendsProfile!.avatar!.avatarURL,
    };

    const myTopEightFriendsIds = modifiedUser!.topEight!;

    const top8FriendQueries = myTopEightFriendsIds.map(async (friendId) => {
      const friend = await db.user.findUnique({
        where: { id: friendId },
        select: { username: true, avatar: { select: { avatarURL: true } } },
      });
      return friend!;
    });

    const myTop8FriendsUsernames = (await Promise.all(top8FriendQueries)).map(
      (friend) => ({
        username: friend.username,
        avatarURL: friend.avatar!.avatarURL,
      })
    );

    const finalFriend = {
      ...modifiedUser,
      topEight: myTop8FriendsUsernames,
      friendCount: modifiedUser.friendIds!.length,
    };

    res.status(200).json({ success: true, data: finalFriend });
  }
);
