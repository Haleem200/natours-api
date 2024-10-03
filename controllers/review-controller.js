const AppError = require('../utils/appError')
const Review = require ('./../models/review-model')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handler-factory')
//const Tour = require ('./../models/tour-model')

exports.setUserTourIds = catchAsync(async (req, res, next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id
    next()
})

/*
exports.duplicateCheck = catchAsync(async (req, res, next) => {
    const duplicate = await Review.find({user: req.body.user, tour: req.body.tour})
    if(duplicate) next(new AppError('you have already reviewed this tour before.', 400))
    else next()
})
*/

exports.createReview = factory.createOne(Review)
exports.getAllReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.deleteReview = factory.deleteOne(Review)
exports.updateReview = factory.updateOne(Review)
