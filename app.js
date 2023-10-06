const express = require('express');
const morgon = require('morgan');
const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Middleware
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

module.exports = app;
