import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import db from '../../prisma/db.setup';
import {
  // saltValue,
  matchSaltedValue,
  sendTokenResponse,
} from '../utils/auth';
import { LoginUserType } from '../zodTypes/auth.types';

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
