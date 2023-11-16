"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePartOneZObject = exports.jwtInfoSchema = exports.RegisterUserZObject = exports.LoginUserZObject = void 0;
const zod_1 = require("zod");
exports.LoginUserZObject = zod_1.z
    .object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
})
    .strict();
exports.RegisterUserZObject = zod_1.z
    .object({
    email: zod_1.z.string().email(),
})
    .strict();
exports.jwtInfoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    iat: zod_1.z.number(),
    exp: zod_1.z.number(),
});
exports.UpdatePartOneZObject = zod_1.z
    .object({
    email: zod_1.z.string().email(),
})
    .strict();
// UpdatePartOneType
