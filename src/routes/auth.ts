import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
} from 'zod-express-middleware';
import {
  LoginUserZObject,
  RegisterUserZObject,
  UpdatePartOneZObject,
} from '../zodTypes/auth.types';

const {
  login,
  register,
  getLoggedInUser,
  randomColor,
  randomAvatar,
  updatePartOne,
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

module.exports = router;
