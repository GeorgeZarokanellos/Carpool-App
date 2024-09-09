import express from 'express';
import {returnTrips, returnSingleTrip, createTrip, updateTrip, deleteTrip, retrieveAllStartLocations} from '../controller/trip_controller';
const router = express.Router();

// return trip info
router.get('/', returnTrips);
router.get('/start-locations', retrieveAllStartLocations);
router.get('/:id', returnSingleTrip);

// create, update, delete trip
router.post('/', createTrip);
router.patch('/:id', updateTrip);
router.delete('/:id', deleteTrip);


export default router;