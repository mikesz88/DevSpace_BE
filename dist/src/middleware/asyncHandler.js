"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch((e) => {
    res.status(400).json({ success: false, error: e, message: e.message });
    next();
});
exports.default = asyncHandler;
