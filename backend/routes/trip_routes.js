const express = require('express');
const router = express.Router();

const {returnTrips, returnSingleTrip, createTrip} = require('../controllers/trip_controller');

router.get('/trips', returnTrips);
router.get('/trips/:id', returnSingleTrip);
router.post('/trips', createTrip);

module.exports = router;