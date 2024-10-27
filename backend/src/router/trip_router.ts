import express from 'express';
import {returnTrips, returnSingleTrip, createTrip, updateTrip, deleteTrip, retrieveAllStartLocations, retrieveTripStatusAndStartingTime} from '../controller/trip_controller';
const router = express.Router();

// return trip info
router.get('/', returnTrips);
router.get('/start-locations', retrieveAllStartLocations);
router.get('/:id', returnSingleTrip);
router.get('/info/:id', retrieveTripStatusAndStartingTime);

// create, update, delete trip
router.post('/', createTrip);
router.patch('/:id', updateTrip);
router.delete('/:id', deleteTrip);


export default router;