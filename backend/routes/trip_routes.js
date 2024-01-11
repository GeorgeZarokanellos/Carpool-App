const express = require('express');
const router = express.Router();
const {returnTrips, returnSingleTrip, createTrip, updateTrip} = require('../controllers/trip_controller');

router.get('/trips', returnTrips);
router.post('/trips', createTrip);

router.get('/trips/:id', returnSingleTrip);
router.patch('/trips/:id', updateTrip)

module.exports = router;