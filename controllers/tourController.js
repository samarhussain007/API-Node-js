const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  if (+val > tours.length) {
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid Id',
    });
  }
  next();
};

exports.validateData = (req, res, next) => {
  const requiredFields = ['name', 'duration'];
  const missingFields = requiredFields.filter((el) => !(el in req.body));
  if (missingFields.length > 0) {
    return res.status(400).json({
      status: 'failed',
      message: `${missingFields} has to be in the body`,
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  const uniqueValue = tours.find((el) => el.id === +req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      uniqueValue,
    },
  });
};

exports.updateTour = (req, res) => {
  const tourIndex = tours.findIndex((el) => el.id === id);
  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'Not Found',
      message: 'Tour not found',
    });
  }
  const { property, value } = req.body;
  if (!property || value === undefined) {
    return res.status(400).json({
      status: 'Bad Request',
      message:
        "Both 'property' and 'value' must be provided in the request body",
    });
  }
  // Check if the specified property exists in the tour object
  if (tours[tourIndex].hasOwnProperty(property)) {
    // Update the specified property dynamically
    tours[tourIndex][property] = value;
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
        res.status(200).json({
          status: 'successfully updated the dataset',
          data: {
            tour: tours[tourIndex], // Send the updated tour data
          },
        });
      }
    );
  } else {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'Specified property does not exist in the tour',
    });
  }
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  const newTours = tours.filter((el) => el.id !== +req.params.id);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(newTours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          tours: newTours,
        },
      });
    }
  );
};
