const express = require('express');
const userController = require('./../controllers/user-controllers');
const authController = require('./../controllers/auth-controller');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/signin').post(authController.signin);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetpassword);

router.use(authController.protect);

router
  .route('/updateMe')
  .patch(
    authController.protect,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  );

router
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);

router
  .route('/me')
  .get(authController.protect, userController.getMe, userController.getUser);

router
  .route('/update-my-password')
  .patch(authController.protect, authController.updatePassword);

router.use(authController.restrictTo('admin'));

// Adminstrator routes
router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
