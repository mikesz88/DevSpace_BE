"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendsUsernameZObject = exports.MyTop8FriendsTypeZObject = exports.AddOrRemoveFriendZObject = exports.UpdatePartTwoZObject = exports.UpdatePartOneZObject = exports.jwtInfoSchema = exports.RegisterUserZObject = exports.LoginUserZObject = void 0;
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
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    username: zod_1.z.string(),
    jobTitle: zod_1.z.string(),
    password: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string().min(8),
})
    .strict();
exports.UpdatePartTwoZObject = zod_1.z
    .object({
    backgroundColor: zod_1.z.string(),
    complimentingColor: zod_1.z.string(),
    favSlogan: zod_1.z.string(),
    favMusic: zod_1.z.string(),
    avatar: zod_1.z.string().min(8),
    biography: zod_1.z.string().min(8),
})
    .strict();
exports.AddOrRemoveFriendZObject = zod_1.z
    .object({
    friendUsernames: zod_1.z.array(zod_1.z.string()),
})
    .strict();
exports.MyTop8FriendsTypeZObject = zod_1.z
    .object({
    myChosenFriendsUsernames: zod_1.z.array(zod_1.z.string()),
})
    .strict();
// friendsUsernameZObject
exports.FriendsUsernameZObject = zod_1.z
    .object({
    username: zod_1.z.string(),
})
    .strict();
