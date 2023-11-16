"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_express_middleware_1 = require("zod-express-middleware");
const auth_types_1 = require("../zodTypes/auth.types");
const { login, register, getLoggedInUser, randomColor, } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const router = (0, express_1.Router)();
router.post('/login', (0, zod_express_middleware_1.validateRequestBody)(auth_types_1.LoginUserZObject), login);
router.post('/register', (0, zod_express_middleware_1.validateRequestBody)(auth_types_1.RegisterUserZObject), register);
router.get('/me', protect, getLoggedInUser);
router.get('/randomColor', randomColor);
module.exports = router;
