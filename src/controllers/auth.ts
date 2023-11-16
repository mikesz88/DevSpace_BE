import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import db from '../../prisma/db.setup';
import {
  saltValue,
  matchSaltedValue,
  sendTokenResponse,
  extractUsername,
  getRandomHexColor,
} from '../utils/auth';
import {
  LoginUserType,
  RegisterUserType,
  UpdatePartOneType,
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
