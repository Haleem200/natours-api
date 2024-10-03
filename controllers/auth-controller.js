const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/user-model');
const appError = require('./../utils/appError');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, status, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  user.passwordConfirm = undefined;

  res.status(status).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    //photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  createSendToken(newUser, 200, res);
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //cheking if the user provided email and password
  if (!email || !password)
    return next(new appError('please provide your email and password', 400));

  //checking if the user exists and the password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new appError('wrong email or password', 401));
  //console.log(await user.checkPassword(password, user.password));

  //if everything is ok, send token to the client

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1)checking if the token exists
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer'))
    return next(
      new appError('you are not logged in! please log in first.', 401)
    ); //401 => unauthorized
  token = token.split(' ')[1];

  if (!token) {
    return next(
      new appError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //because this function in 'catchAsync' function, any error that happens while executing this line will be passed to the error
  //controller. we are already handling two types of these errors that might happen (JsonWebTokenError, TokenExpiredError)

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new appError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new appError(
          'You do not have the permission to perform this action',
          403
        )
      );

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new appError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetpassword = catchAsync(async (req, res, next) => {
  const sentToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: sentToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  /*  
  if(req.body.password != req.body.passwordConfirm) 
    return next(new appError('the password and the password confirm are not matchd', 401))
  No need for this because the validator of passwordConfirm (review the user model) will take care of it
*/

  if (!user)
    return next(new appError('Reset token is invalid or expired', 400));

  if (user.passwordResetToken === sentToken) {
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save();

    createSendToken(user, 200, res);
  }
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const sentPassword = req.body.password;
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.checkPassword(sentPassword, user.password))) {
    return next(new appError('wrong password, please try again', 401));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
