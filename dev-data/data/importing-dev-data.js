const mongoose = require('mongoose')
const fs = require('fs')
const Tour = require ('./../../models/tour-model')
const User = require ('./../../models/user-model')
const Review = require ('./../../models/review-model')



const dotEenv = require('dotenv');
dotEenv.config({ path: './config.env' });

const passowrd = process.env.DATABASE_PASSWORD
const DB = process.env.DATABASE.replace('<PASSWORD>', passowrd)

mongoose.connect(DB).then(() => {
  console.log('DB connection sucessfull!');
}).catch(err => console.log(err))

const importData = async () => {
    const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`))
    const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`))
    const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`))

    
    try{
        await Tour.create(tours)
        await User.create(users, {validateBeforeSave: false})
        await Review.create(reviews, {validateBeforeSave: false})
        console.log('Data successfully loaded!');
    } catch(err) {
        console.log(err);
    }
    process.exit()
}

const deleteData = async () => {
    try{
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit()
}

if (process.argv[2] === '--import')
    importData()
else if (process.argv[2] == '--delete')
    deleteData()

