"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_setup_1 = __importDefault(require("../../prisma/db.setup"));
const auth_1 = require("../utils/auth");
const asyncHandler_1 = __importDefault(require("./asyncHandler"));
exports.protect = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const [, token] = ((_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split) === null || _b === void 0 ? void 0 : _b.call(_a, ' ')) || [];
    const myJwtData = (0, auth_1.getDataFromAuthToken)(token);
    if (!myJwtData) {
        return res.status(401).json({ success: false, message: 'Invalid Token' });
    }
    const userFromJwt = yield db_setup_1.default.user.findUnique({
        where: {
            id: myJwtData.id,
        },
    });
    if (!userFromJwt) {
        return res
            .status(401)
            .json({ success: false, message: 'Authentication failed' });
    }
    req.currentUser = userFromJwt;
    next();
}));
