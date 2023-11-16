"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan = require('morgan');
const xss = require('xss-clean');
const hpp = require('hpp');
exports.app = (0, express_1.default)();
dotenv_1.default.config();
console.log(process.env.NODE_ENV);
exports.app.use(express_1.default.json());
// security features
exports.app.use((0, helmet_1.default)());
exports.app.use(xss());
exports.app.use(hpp());
exports.app.use((0, cors_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 200,
});
exports.app.use(limiter);
// Route files
const auth = require('./routes/auth');
if (process.env.NODE_ENV === 'development') {
    exports.app.use(morgan('dev'));
}
exports.app.use(express_1.default.urlencoded({ extended: true }));
// Routes
exports.app.use('/api/v1/auth', auth);
const PORT = process.env.PORT || 3000;
const server = exports.app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    if (server) {
        server.close(() => process.exit(1));
    }
    else {
        console.error('Server is not available. Exiting...');
        process.exit(1);
    }
});
