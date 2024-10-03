const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required:[true, 'A tour must have a name'],
      trim: true,
      unique: true,
      minLength: [10, 'A tour name must have at least 10 characters'],
      maxLength: [40, 'A tour name cannot have more than 40 character']
    },
    slug: String,
    secretTour: Boolean,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duaration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      trim: true,
      enum: {
        values: ['difficult', 'easy', 'medium'],
        message: 'difficulty must be either difficult, easy or medium' 
      } 
    },
    ratingsAverage: {
      type: Number,
      //default: 4.5,
      min: [1, 'ratingsAverage must be above 1'],
      max: [5, 'ratingsAverage cannot be above 5'],
      set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      dafault: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount:{
      type: Number,
      validate:{
        validator: function(val) {
          return val < this.price
        },
        message: 'discount price ({VALUE})cannot be greater than the reqular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A Tour must have a summary'],
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      trim: true,
      required: [true, 'A tour must have an image cover']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],

  startLocation: {
    type:{
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    },
    address: String,
    description: String
  },

  locations: [{
    type:{
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
    },
    address: String,
    description: String,
    day: Number
  }],
  guides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
},
  
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }
)
  tourSchema.index({price: 1, ratingsAverage: -1})
  tourSchema.index({slug: 1})

  tourSchema.virtual('durationInWeeks').get(function() {
    return this.duration / 7;
  })

  tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField:'tour',
    localField:'_id'
  })
  
  tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true})
    next()
  })

  
  tourSchema.pre(/^find/, function(next){
    this.find({ secretTour : {$ne: 'true'} })
    this.start = Date.now()
    next()
  })

  tourSchema.pre(/^find/, function(next){
    this.populate({
      path: 'guides',
      select: '-passwordChangedAt -__v'
    })
    next()
  })
  

  tourSchema.post(/^find/, function(docs, next){
    console.log(`query took ${Date.now() - this.start} milliseconds`);
    //console.log(docs[8]);
    next()
  })

  tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match : { secretTour : { $ne: 'true'} }} )
    next()
  })
  

  const Tour = mongoose.model('Tour', tourSchema)
  module.exports = Tour


