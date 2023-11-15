import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import db from '../../prisma/db.setup';
import {
  saltValue,
  matchSaltedValue,
  sendTokenResponse,
  extractUsername,
} from '../utils/auth';
import { LoginUserType, RegisterUserType } from '../zodTypes/auth.types';

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
