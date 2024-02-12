import express from 'express';
import {returnTrips, returnSingleTrip, createTrip, updateTrip, deleteTrip} from '../controllers/trip_controller';
const router = express.Router();

// return trip info
router.get('/', returnTrips);
router.get('/:id', returnSingleTrip);

// create, update, delete trip
router.post('/', createTrip);
router.patch('/trips/:id', updateTrip)
router.delete('/trips/:id', deleteTrip);

export default router;