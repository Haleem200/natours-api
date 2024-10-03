const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});
const app = require('./app');

const passowrd = process.env.DATABASE_PASSWORD;
const DB = process.env.DATABASE.replace('<PASSWORD>', passowrd);

mongoose.connect(DB).then(() => {
  console.log('DB connection sucessfull!');
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`server is working on port ${port}`);
  //console.log(process.env.NODE_ENV);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandled rejection, shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
