const express = require('express')
const reviewController = require('./../controllers/review-controller')
const authController = require('./../controllers/auth-controller')


const router = express.Router({mergeParams: true})

router.use(authController.protect)

router
    .get('/' , reviewController.getAllReviews)
    .post('/', authController.restrictTo('user'), reviewController.setUserTourIds, /*reviewController.duplicateCheck,*/ reviewController.createReview)
    
router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview)
    .patch(authController.restrictTo('user', 'admin'),reviewController.updateReview)
    
module.exports = router