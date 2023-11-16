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
exports.seed = void 0;
const db_setup_1 = __importDefault(require("./db.setup"));
const auth_1 = require("../src/utils/auth");
const avatar_1 = require("../_data/avatar");
const avatarsToDB = (avatars) => __awaiter(void 0, void 0, void 0, function* () {
    const mappedAvatars = avatars.map((avatarObject) => {
        return db_setup_1.default.avatar.create({
            data: {
                title: avatarObject.title,
                avatarURL: avatarObject.avatarURL,
            },
        });
    });
    yield Promise.all(mappedAvatars);
    console.log('Avatar Seeding complete');
});
const clearDb = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_setup_1.default.user.deleteMany();
    yield db_setup_1.default.password.deleteMany();
});
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Seeding the database...');
    yield clearDb();
    yield avatarsToDB(avatar_1.avatars);
    // seed here
    const michael = yield db_setup_1.default.user.create({
        data: {
            email: 'michael.sanchez@devspace.com',
            username: 'michael.sanchez',
            password: {
                create: {
                    password: yield (0, auth_1.saltValue)('12345678'),
                },
            },
        },
    });
    const Charles = yield db_setup_1.default.user.create({
        data: {
            email: 'charles.best.zambrana@devspace.com',
            username: 'charles.best.zambrana',
            password: {
                create: {
                    password: yield (0, auth_1.saltValue)('12345678'),
                },
            },
        },
    });
    const Richard = yield db_setup_1.default.user.create({
        data: {
            email: 'richard.olpindo@devspace.com',
            username: 'richard.olpindo',
            password: {
                create: {
                    password: yield (0, auth_1.saltValue)('12345678'),
                },
            },
        },
    });
    const Quallin = yield db_setup_1.default.user.create({
        data: {
            email: 'quallin.games@devspace.com',
            username: 'quallin.games',
            password: {
                create: {
                    password: yield (0, auth_1.saltValue)('12345678'),
                },
            },
        },
    });
    const Craig = yield db_setup_1.default.user.create({
        data: {
            email: 'craig.howard@devspace.com',
            username: 'craig.howard',
            password: {
                create: {
                    password: yield (0, auth_1.saltValue)('12345678'),
                },
            },
        },
    });
    const users = [michael, Charles, Richard, Quallin, Craig];
    console.log({ users });
});
exports.seed = seed;
(0, exports.seed)()
    .then(() => {
    console.log('Seeding complete');
})
    .catch((e) => {
    console.error(e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_setup_1.default.$disconnect();
}));
