const express = require('express');
const router = express.Router();

const {displayTrips, displaySingleTrip, createTrip} = require('../controllers/trip_controller');

router.get('/trips', displayTrips);
router.get('/trips/:id', displaySingleTrip);
router.post('/trips', createTrip);

module.exports = router;