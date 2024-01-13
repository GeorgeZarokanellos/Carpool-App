const express = require('express');
const router = express.Router();
const {returnTrips, returnSingleTrip, createTrip, updateTrip, deleteTrip} = require('../controllers/trip_controller');

//return trip info
router.get('/trips', returnTrips);
router.get('/trips/:id', returnSingleTrip);

//create, update, delete trip
router.post('/trips', createTrip);
router.patch('/trips/:id', updateTrip)
router.delete('/trips/:id', deleteTrip);
module.exports = router;