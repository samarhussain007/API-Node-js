// ------------------- Modules Requirements --------------------------- //

const express = require('express');
const morgon = require('morgan');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

// --------------------------------------------------- /

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// ------------------- Database Configuration and connection --------------------------- //

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

async function connectDB() {
  const data = await mongoose.connect(DB);
  return data;
}

connectDB()
  .then(() => console.log('Connection is successfull'))
  .catch((err) => console.log(`'Error encountered ${err}`));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

// --------------------------------------------------- //

// ------------------- Middlewares --------------------------- //
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgon('dev'));
}
app.use(express.static(`${__dirname}/public`)); // Extracting static files when the endpoint is visited

app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route handlers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// --------------------------------------------------- /

module.exports = app;
