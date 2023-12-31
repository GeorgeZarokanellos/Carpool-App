const express = require('express');
const router = express.Router();

const {displayTrips} = require('../controllers/trip_controllers');

router.get('/trips', displayTrips);

module.exports = router;