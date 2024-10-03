const mongoose = require ('mongoose')
const { aggregate } = require('./user-model')
const Tour = require ('./../models/tour-model')

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Your must provide your review body!']
    },
    rating: {
        type: Number,
        required: [true, 'You must provide a tour rating!'],
        min: 0,
        max: 5
    },
    tour:{
        type: mongoose.Schema.ObjectId,
        ref: 'Tour'
       // required: [true, 'You must specify the tour you are rating!']
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Missing user id!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path:'user',
        select: 'name photo'
    })
    next()
})

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match : { tour : tourId }
        },
        {
            $group: {
                _id : '$tour',
                nRating: { $sum : 1 },
                avgRating: { $avg : '$rating' }
            }            
        }
    ])
    //console.log(stats);
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating
    });
}

reviewSchema.post('save', function(){
    //this keyword referes to document
    this.constructor.calcAverageRatings(this.tour)
})

reviewSchema.post(/^findOneAnd/, async function(doc) {
    await doc.constructor.calcAverageRatings(doc.tour)
});
  


const Review = mongoose.model('Review', reviewSchema)
module.exports = Review