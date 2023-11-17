import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
} from 'zod-express-middleware';
import {
  AddOrRemoveFriendZObject,
  FriendsUsernameZObject,
  LoginUserZObject,
  MyTop8FriendsTypeZObject,
  RegisterUserZObject,
  UpdatePartOneZObject,
  UpdatePartTwoZObject,
} from '../zodTypes/auth.types';

const {
  login,
  register,
  getLoggedInUser,
  randomColor,
  randomAvatar,
  updatePartOne,
  updatePartTwo,
  availableFriends,
  myFriendCount,
  myFriendsUsernames,
  addFriends,
  removeFriends,
  myTopEightFriends,
  createTop8Friends,
  deleteMe,
  friendsProfile,
} = require('../controllers/auth');

const { protect } = require('../middleware/auth');

const router = Router();

router.post('/login', validateRequestBody(LoginUserZObject), login);
router.post('/register', validateRequestBody(RegisterUserZObject), register);
router.get('/me', protect, getLoggedInUser);
router.get('/randomColor', randomColor);
router.get('/randomAvatar', randomAvatar);
router.patch(
  '/updatePartOne',
  protect,
  validateRequestBody(UpdatePartOneZObject),
  updatePartOne
);
router.patch(
  '/updatePartTwo',
  protect,
  validateRequestBody(UpdatePartTwoZObject),
  updatePartTwo
);

// !test
router.get('/availableFriends', protect, availableFriends);
router.get('/myFriendCount', protect, myFriendCount);
router.get('/myFriendsUsernames', protect, myFriendsUsernames);
router.get('/myTopEightFriends', protect, myTopEightFriends);
router.delete('/deleteMe', protect, deleteMe);
router.patch(
  '/addFriends',
  protect,
  validateRequestBody(AddOrRemoveFriendZObject),
  addFriends
);
router.patch(
  '/removeFriends',
  protect,
  validateRequestBody(AddOrRemoveFriendZObject),
  removeFriends
);
router.patch(
  '/removeFriends',
  protect,
  validateRequestBody(MyTop8FriendsTypeZObject),
  createTop8Friends
);
router.get(
  '/friendsProfile/:username',
  protect,
  validateRequestParams(FriendsUsernameZObject),
  friendsProfile
);

module.exports = router;
