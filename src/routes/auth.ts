import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
} from 'zod-express-middleware';
import { LoginUser, RegisterUser } from '../zodTypes/auth.types';

const { login, register, getLoggedInUser } = require('../controllers/auth');

const { protect } = require('../middleware/auth');

const router = Router();

router.post('/login', validateRequestBody(LoginUser), login);
router.post('/register', validateRequestBody(RegisterUser), register);
router.get('/me', protect, getLoggedInUser);

module.exports = router;
