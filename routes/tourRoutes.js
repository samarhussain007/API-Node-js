const express = require('express');
const tourController = require('../controllers/tourController');

const { getAllTours, createTour, getTour, updateTour, deleteTour } =
  tourController;

const { checkId, validateData } = require('../controllers/tourController');

const router = express.Router();

//PARAM MIDDLEWARE FUNCTIONS
router.param('id', checkId);

router.route('/').get(getAllTours).post(validateData, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
