import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
} from 'zod-express-middleware';
import { LoginUserZObject, RegisterUserZObject } from '../zodTypes/auth.types';

const {
  login,
  register,
  getLoggedInUser,
  randomColor,
} = require('../controllers/auth');

const { protect } = require('../middleware/auth');

const router = Router();

router.post('/login', validateRequestBody(LoginUserZObject), login);
router.post('/register', validateRequestBody(RegisterUserZObject), register);
router.get('/me', protect, getLoggedInUser);
router.get('/randomColor', randomColor);

module.exports = router;
