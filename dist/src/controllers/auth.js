"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const db_setup_1 = __importDefault(require("../../prisma/db.setup"));
const auth_1 = require("../utils/auth");
// * @desc Login
// * @route POST /api/v1/auth/login
// * @access PUBLIC
exports.login = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield db_setup_1.default.user.findUnique({
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
    const userHashedPassword = yield db_setup_1.default.password.findUnique({
        where: {
            userId: user.id,
        },
        select: {
            password: true,
        },
    });
    const isMatch = yield (0, auth_1.matchSaltedValue)(password, userHashedPassword.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Email and/or Password is incorrect.',
        });
    }
    (0, auth_1.sendTokenResponse)(user.id, 200, res);
}));
// * @route GET /api/v1/auth/me
// * @access PRIVATE
exports.getLoggedInUser = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_setup_1.default.user.findUnique({
        where: { id: req.currentUser.id },
        include: { avatar: { select: { avatarURL: true } } },
    });
    const modifiedUser = Object.assign(Object.assign({}, user), { avatar: user.avatar.avatarURL });
    const myTopEightFriendsIds = modifiedUser.topEight;
    const top8FriendQueries = myTopEightFriendsIds.map((friendId) => __awaiter(void 0, void 0, void 0, function* () {
        const friend = yield db_setup_1.default.user.findUnique({
            where: { id: friendId },
            select: { username: true, avatar: { select: { avatarURL: true } } },
        });
        return friend;
    }));
    const myTop8FriendsUsernames = (yield Promise.all(top8FriendQueries)).map((friend) => ({
        username: friend.username,
        avatarURL: friend.avatar.avatarURL,
    }));
    const finalFriend = Object.assign(Object.assign({}, modifiedUser), { topEight: myTop8FriendsUsernames, friendCount: modifiedUser.friendIds.length });
    res.status(200).json({ success: true, data: finalFriend });
    res.status(200).json({
        success: true,
        data: user,
    });
}));
// * @desc Register User
// * @route POST /api/v1/auth/register
// * @access PUBLIC
exports.register = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const checkEmail = yield db_setup_1.default.user.findUnique({
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
    const username = (0, auth_1.extractUsername)(email);
    if (!username) {
        return res.status(401).json({
            success: false,
            message: 'Email is not valid',
        });
    }
    const user = yield db_setup_1.default.user.create({
        data: {
            email,
            username,
        },
    });
    (0, auth_1.sendTokenResponse)(user.id, 201, res);
}));
// * @desc GET random color
// * @route GET /api/v1/auth/randomColor
// * @access PUBLIC
exports.randomColor = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const randomColor = (0, auth_1.getRandomHexColor)();
    res.status(200).json({
        success: true,
        data: randomColor,
    });
}));
// * @desc GET random Avatar
// * @route GET /api/v1/auth/randomAvatar
// * @access PUBLIC
exports.randomAvatar = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const allAvatars = yield db_setup_1.default.avatar.findMany();
    const randomAvatar = allAvatars[Math.floor(Math.random() * allAvatars.length)];
    res.status(200).json({
        success: true,
        data: randomAvatar.avatarURL,
    });
}));
// * @desc Update Profile part one
// * @route PATCH /api/v1/auth/updatePartOne
// * @access PRIVATE
exports.updatePartOne = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, username, jobTitle, password, confirmPassword, } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'The password and Confirm password do not match.',
        });
    }
    const allUsernames = yield db_setup_1.default.user.findMany({ select: { username: true } });
    const isInvalidUsername = allUsernames.some((obj) => obj.username.toLowerCase() === username.toLowerCase());
    if (isInvalidUsername) {
        return res.status(400).json({
            success: false,
            message: 'The username is already taken by someone else. Try another one.',
        });
    }
    yield db_setup_1.default.user.update({
        where: {
            id: req.currentUser.id,
        },
        data: {
            firstName,
            lastName,
            username,
            jobTitle,
        },
    });
    const alreadyHavePassword = yield db_setup_1.default.password.findUnique({
        where: { userId: req.currentUser.id },
    });
    if (alreadyHavePassword) {
        yield db_setup_1.default.password.update({
            where: { userId: req.currentUser.id },
            data: { password: yield (0, auth_1.saltValue)(password) },
        });
    }
    else {
        yield db_setup_1.default.password.create({
            data: {
                userId: req.currentUser.id,
                password: yield (0, auth_1.saltValue)(password),
            },
        });
    }
    res.status(200).json({
        success: true,
        message: 'User has been updated',
    });
}));
// * @desc Update Profile part two
// * @route PATCH /api/v1/auth/updatePartTwo
// * @access PRIVATE
exports.updatePartTwo = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { backgroundColor, complimentingColor, favSlogan, favMusic, avatar, biography, } = req.body;
    const chosenAvatar = yield db_setup_1.default.avatar.findFirst({
        where: { avatarURL: avatar },
    });
    if (!chosenAvatar) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Avatar URL.',
        });
    }
    if (!(0, auth_1.isHexColor)(backgroundColor) || !(0, auth_1.isHexColor)(complimentingColor)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Hex Color Code. Please try again.',
        });
    }
    yield db_setup_1.default.user.update({
        where: { id: req.currentUser.id },
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
}));
// * @desc List of Available Friends
// * @route GET /api/v1/auth/availableFriends
// * @access PRIVATE
exports.availableFriends = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const myCurrentFriends = yield db_setup_1.default.user.findUnique({
        where: { id: req.currentUser.id },
        select: { friendIds: true },
    });
    const myIdAndCurrentFriendsIdsOnly = myCurrentFriends.friendIds;
    myIdAndCurrentFriendsIdsOnly.push(req.currentUser.id);
    const allUsers = (yield db_setup_1.default.user.findMany({ select: { id: true } })).map((user) => user.id);
    const eligibleFriends = allUsers.filter((potentialFriendId) => !myIdAndCurrentFriendsIdsOnly.includes(potentialFriendId));
    const friendQueries = eligibleFriends.map((friendId) => __awaiter(void 0, void 0, void 0, function* () {
        const friend = yield db_setup_1.default.user.findUnique({
            where: { id: friendId },
            select: { username: true },
        });
        return friend.username;
    }));
    const eligibleFriendsUsernames = yield Promise.all(friendQueries);
    res.status(200).json({ success: true, data: eligibleFriendsUsernames });
}));
// * @desc Friends Count
// * @route GET /api/v1/auth/myFriendCount
// * @access PRIVATE
exports.myFriendCount = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const myFriends = yield db_setup_1.default.user.findUnique({
        where: { id: req.currentUser.id },
        select: { friendIds: true },
    });
    const myFriendsCount = myFriends.friendIds.length;
    res.status(200).json({ success: true, data: myFriendsCount });
}));
// * @desc All my friends Usernames
// * @route GET /api/v1/auth/myFriendsUsernames
// * @access PRIVATE
exports.myFriendsUsernames = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const myFriends = yield db_setup_1.default.user.findUnique({
        where: { id: req.currentUser.id },
        select: { friendIds: true },
    });
    const myFriendsIds = myFriends.friendIds;
    const friendQueries = myFriendsIds.map((friendId) => __awaiter(void 0, void 0, void 0, function* () {
        const friend = yield db_setup_1.default.user.findUnique({
            where: { id: friendId },
            select: { username: true },
        });
        return friend.username;
    }));
    const friendsUsernames = yield Promise.all(friendQueries);
    res.status(200).json({ success: true, data: friendsUsernames });
}));
// * @desc Add Friend
// * @route PATCH /api/v1/auth/addFriends
// * @access PRIVATE
exports.addFriends = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { friendUsernames } = req.body;
    const friendQueries = friendUsernames.map((friendUsername) => __awaiter(void 0, void 0, void 0, function* () {
        const friend = yield db_setup_1.default.user.findUnique({
            where: { username: friendUsername },
            select: { id: true },
        });
        return friend.id;
    }));
    const newFriendsIds = yield Promise.all(friendQueries);
    const myCurrentFriends = yield db_setup_1.default.user.findUnique({
        where: { id: req.currentUser.id },
        select: { friendIds: true },
    });
    const myCurrentFriendsId = myCurrentFriends.friendIds;
    const combinedArrayOfOldAndNewFriendsIds = [
        ...myCurrentFriendsId,
        ...newFriendsIds,
    ];
    yield db_setup_1.default.user.update({
        where: { id: req.currentUser.id },
        data: { friendIds: combinedArrayOfOldAndNewFriendsIds },
    });
    res.status(200).json({ success: true, message: 'Friend list updated.' });
}));
// * @desc Remove Friend
// * @route PATCH /api/v1/auth/removeFriends
// * @access PRIVATE
exports.removeFriends = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { friendUsernames } = req.body;
    const friendQueries = friendUsernames.map((friendUsername) => __awaiter(void 0, void 0, void 0, function* () {
        const friend = yield db_setup_1.default.user.findUnique({
            where: { username: friendUsername },
            select: { id: true },
        });
        return friend.id;
    }));
    const removingFriendsIds = yield Promise.all(friendQueries);
    const myCurrentFriends = yield db_setup_1.default.user.findUnique({
        where: { id: req.currentUser.id },
        select: { friendIds: true },
    });
    const myCurrentFriendsId = myCurrentFriends.friendIds;
    const myUpdatedFriendList = myCurrentFriendsId.filter((friendId) => !removingFriendsIds.includes(friendId));
    yield db_setup_1.default.user.update({
        where: { id: req.currentUser.id },
        data: { friendIds: myUpdatedFriendList },
    });
    res.status(200).json({ success: true, message: 'Friend list updated.' });
}));
// * @desc My current Top 8 Friends
// * @route GET /api/v1/auth/myTopEightFriends
// * @access PRIVATE
exports.myTopEightFriends = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const myTopEightFriends = yield db_setup_1.default.user.findUnique({
        where: { id: req.currentUser.id },
        select: { topEight: true },
    });
    const myTopEightFriendsIds = myTopEightFriends.topEight;
    const friendQueries = myTopEightFriendsIds.map((friendId) => __awaiter(void 0, void 0, void 0, function* () {
        const friend = yield db_setup_1.default.user.findUnique({
            where: { id: friendId },
            select: { username: true, avatar: { select: { avatarURL: true } } },
        });
        return friend;
    }));
    const myTop8FriendsUsernames = (yield Promise.all(friendQueries)).map((friend) => {
        var _a;
        return ({
            username: friend.username,
            avatarURL: ((_a = friend.avatar) === null || _a === void 0 ? void 0 : _a.avatarURL) ||
                'https://alienbudgets.s3.amazonaws.com/001-chameleon.png',
        });
    });
    res.status(200).json({ success: true, data: myTop8FriendsUsernames });
}));
// * @desc Create My Top 8 Friends
// * @route PATCH /api/v1/auth/createTop8Friends
// * @access PRIVATE
exports.createTop8Friends = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { myChosenFriendsUsernames } = req.body;
    const friendQueries = myChosenFriendsUsernames.map((friendUsername) => __awaiter(void 0, void 0, void 0, function* () {
        const friend = yield db_setup_1.default.user.findUnique({
            where: { username: friendUsername },
            select: { id: true },
        });
        return friend.id;
    }));
    const myTop8FriendsIds = yield Promise.all(friendQueries);
    yield db_setup_1.default.user.update({
        where: { id: req.currentUser.id },
        data: { topEight: myTop8FriendsIds },
    });
    res
        .status(200)
        .json({ success: true, message: 'Top 8 Friends, completed.' });
}));
// * @desc Delete Profile
// * @route DELETE /api/v1/auth/deleteMe
// * @access PRIVATE
exports.deleteMe = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const usersWhoFriendedMe = yield db_setup_1.default.user.findMany({
        where: {
            friendIds: {
                has: req.currentUser.id,
            },
        },
    });
    const usersWhoTop8Me = yield db_setup_1.default.user.findMany({
        where: {
            topEight: {
                has: req.currentUser.id,
            },
        },
    });
    const usersToUpdate = [...usersWhoFriendedMe, ...usersWhoTop8Me];
    if (usersToUpdate.length === 0) {
        yield db_setup_1.default.user.delete({ where: { id: req.currentUser.id } });
        return res.status(200).json({ success: true, message: 'User Deleted.' });
    }
    const updatePromises = usersToUpdate.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedFriendIds = user.friendIds.filter((id) => id !== req.currentUser.id);
        const updatedTopEight = user.topEight.filter((id) => id !== req.currentUser.id);
        yield db_setup_1.default.user.update({
            where: { id: user.id },
            data: {
                friendIds: updatedFriendIds,
                topEight: updatedTopEight,
            },
        });
    }));
    yield Promise.all(updatePromises);
    yield db_setup_1.default.user.delete({ where: { id: req.currentUser.id } });
    res.status(200).json({ success: true, message: 'User Deleted.' });
}));
// * @desc Friends Profile
// * @route GET /api/v1/auth/friendsProfile/:username
// * @access PRIVATE
exports.friendsProfile = (0, asyncHandler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    const friendsProfile = yield db_setup_1.default.user.findUnique({
        where: { username },
        include: { avatar: { select: { avatarURL: true } } },
    });
    const modifiedUser = Object.assign(Object.assign({}, friendsProfile), { avatar: friendsProfile.avatar.avatarURL });
    const myTopEightFriendsIds = modifiedUser.topEight;
    const top8FriendQueries = myTopEightFriendsIds.map((friendId) => __awaiter(void 0, void 0, void 0, function* () {
        const friend = yield db_setup_1.default.user.findUnique({
            where: { id: friendId },
            select: { username: true, avatar: { select: { avatarURL: true } } },
        });
        return friend;
    }));
    const myTop8FriendsUsernames = (yield Promise.all(top8FriendQueries)).map((friend) => ({
        username: friend.username,
        avatarURL: friend.avatar.avatarURL,
    }));
    const finalFriend = Object.assign(Object.assign({}, modifiedUser), { topEight: myTop8FriendsUsernames, friendCount: modifiedUser.friendIds.length });
    res.status(200).json({ success: true, data: finalFriend });
}));
