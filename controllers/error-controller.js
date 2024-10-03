const AppError = require('./../utils/appError');

const sendErrorDev = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
  
    } else {
        res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
};


// HANDLERS FOR MONGOOSE ERRORS
const hadleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {

  const errors = Object.values(err.errors).map(el => el.message )

  const message = `invlaid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleDuplicateFieldDb = (err) => {
  const message = `Duplicate field value: '${err.keyValue.name}', please use anothe one`
  return new AppError(message, 400)
}

const handleJwtError = (err) => {
  const message = 'Invalid Token, please log in again!'
  return new AppError(message, 401)
}

const handleExpiredToken = (err) => {
  const message = 'Expired token, please login again'
  return new AppError(message, 401)
}

//THE GLOBAL ERROR CONTROLLER
module.exports = (err, req, res, next) => {  

    console.log(err.message);

    err.status = err.status || 'error'
    err.statusCode = err.statusCode || 500

    if(process.env.NODE_ENV.trim() === 'development'){
        sendErrorDev(err, res)
    }
    
    else if(process.env.NODE_ENV.trim() === 'production'){
      let error = { ...err };    

      if(err.name === 'CastError') error = hadleCastErrorDB(error)
      if(err.name === 'ValidationError') error = handleValidationErrorDB(error)
      if(err.code === 11000) error = handleDuplicateFieldDb(error)
      if(err.name === 'JsonWebTokenError') error = handleJwtError(error)
      if(err.name === 'TokenExpiredError') error = handleExpiredToken(error)
      
      sendErrorProd(err, res)
    }
}