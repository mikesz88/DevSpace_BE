import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
} from 'zod-express-middleware';
import { LoginUser } from '../zodTypes/auth.types';

const { login } = require('../controllers/auth');

const { protect } = require('../middleware/auth');

const router = Router();

router.post('/login', validateRequestBody(LoginUser), login);

module.exports = router;
