import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
} from 'zod-express-middleware';
import {
  LoginUserZObject,
  RegisterUserZObject,
  UpdatePartOneZObject,
  UpdatePartTwoZObject,
} from '../zodTypes/auth.types';

const {
  login,
  register,
  getLoggedInUser,
  randomColor,
  randomAvatar,
  updatePartOne,
  updatePartTwo,
} = require('../controllers/auth');

const { protect } = require('../middleware/auth');

const router = Router();

router.post('/login', validateRequestBody(LoginUserZObject), login);
router.post('/register', validateRequestBody(RegisterUserZObject), register);
router.get('/me', protect, getLoggedInUser);
router.get('/randomColor', randomColor);
router.get('/randomAvatar', randomAvatar);
router.patch(
  '/updatePartOne',
  protect,
  validateRequestBody(UpdatePartOneZObject),
  updatePartOne
);
router.patch(
  '/updatePartTwo',
  protect,
  validateRequestBody(UpdatePartTwoZObject),
  updatePartTwo
);

module.exports = router;
