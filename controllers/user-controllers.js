const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/user-model');
const appError = require('./../utils/appError');
const factory = require('./handler-factory');
const AppError = require('./../utils/appError');

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/img/users');
//   },

//   filename: function (req, file, cb) {
//     console.log(file.mimetype);
//     const extention = file.mimetype.split('/')[1];
//     console.log(extention);
//     cb(null, `user-${req.user.id}-${Date.now()}.${extention}`);
//   },
// });

const multerStorage = multer.memoryStorage();

function multerFilter(req, file, cb) {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('not an image! please upload only images.', 400), false);
}
const upload = multer({ storage: multerStorage, filter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateMe = async (req, res, next) => {
  console.log(req.body);

  if (req.body.password || req.body.passwordConfirm)
    return next(
      new appError(
        'passwords can be changed throught the /update-my-password route',
        400
      )
    );

  //{photo: req.file.filename}
  const fieldsToBeUpdated = filterObj(req.body, 'name', 'email');
  if (req.file) fieldsToBeUpdated.photo = req.file.filename;
  if (req.file) fieldsToBeUpdated.photo = req.file.filename;

  console.log(fieldsToBeUpdated);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToBeUpdated,
    {
      new: true,
      runValidators: true,
    }
  );

  console.log(updatedUser);
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
