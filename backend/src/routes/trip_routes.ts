import express from 'express';
import {returnTrips, returnSingleTrip, createTrip, updateTrip, deleteTrip} from '../controllers/trip_controller';
const router = express.Router();

//return trip info
router.get('/trips', returnTrips);
router.get('/trips/:id', returnSingleTrip);

//create, update, delete trip
router.post('/trips', createTrip);
router.patch('/trips/:id', updateTrip)
router.delete('/trips/:id', deleteTrip);

module.exports = router;