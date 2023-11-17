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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHexColor = exports.getRandomHexColor = exports.extractUsername = exports.getDataFromAuthToken = exports.sendTokenResponse = exports.matchSaltedValue = exports.getSignedJwt = exports.saltValue = void 0;
const auth_types_1 = require("../zodTypes/auth.types");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// to be used for password
const saltValue = (value) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt.genSalt(10);
    return yield bcrypt.hash(value, salt);
});
exports.saltValue = saltValue;
// Sign JWT and return
// changed from id to email bc it is unique
const getSignedJwt = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
});
exports.getSignedJwt = getSignedJwt;
// to be used for password comparison
const matchSaltedValue = (value, saltedValue) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.compare(value, saltedValue);
});
exports.matchSaltedValue = matchSaltedValue;
const sendTokenResponse = (id, statusCode, res) => {
    const token = (0, exports.getSignedJwt)(id);
    res.status(statusCode).json({ success: true, token });
};
exports.sendTokenResponse = sendTokenResponse;
const getDataFromAuthToken = (token) => {
    if (!token)
        return null;
    try {
        return auth_types_1.jwtInfoSchema.parse(jwt.verify(token, process.env.JWT_SECRET));
    }
    catch (e) {
        return null;
    }
};
exports.getDataFromAuthToken = getDataFromAuthToken;
const extractUsername = (email) => {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1) {
        return email.substring(0, atIndex);
    }
    else {
        return false;
    }
};
exports.extractUsername = extractUsername;
const getRandomHexColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
exports.getRandomHexColor = getRandomHexColor;
const isHexColor = (hexCode) => {
    const pattern = /^#[A-Fa-f0-9]{6}$/;
    return pattern.test(hexCode);
};
exports.isHexColor = isHexColor;
