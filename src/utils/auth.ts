import { Response } from 'express';
import { jwtInfoSchema } from '../zodTypes/auth.types';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// to be used for password
export const saltValue = async (value: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(value, salt);
};

// Sign JWT and return
// changed from id to email bc it is unique
export const getSignedJwt = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

// to be used for password comparison
export const matchSaltedValue = async (value: string, saltedValue: string) => {
  return await bcrypt.compare(value, saltedValue);
};

export const sendTokenResponse = (
  id: string,
  statusCode: number,
  res: Response
) => {
  const token = getSignedJwt(id);

  res.status(statusCode).json({ success: true, token });
};

export const getDataFromAuthToken = (token?: string) => {
  if (!token) return null;

  try {
    return jwtInfoSchema.parse(jwt.verify(token, process.env.JWT_SECRET));
  } catch (e) {
    return null;
  }
};

export const extractUsername = (email: string): string | false => {
  const atIndex = email.indexOf('@');

  if (atIndex !== -1) {
    return email.substring(0, atIndex);
  } else {
    return false;
  }
};

export const getRandomHexColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
