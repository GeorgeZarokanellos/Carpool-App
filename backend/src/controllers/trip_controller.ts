import { type Request, type Response } from 'express';
import { Trip, TripPassengers, TripStops, Stops, User, Driver } from '../models/associations';
import { type passengerInterface, type stopLocInterface, type updateDetailsInterface } from '../interfaces/trip_interfaces';

const addPassengersToTrip = async(passengers: passengerInterface[], Trip: Trip): Promise<void> => {
    if(passengers.length > 0){
        const firstNames = passengers.map(passenger => passenger.firstName);    // returns an array of first names of the passengers to be added
        const lastNames = passengers.map(passenger => passenger.lastName);      // returns an array of last names of the passengers to be added
        const tripPassengersNames = await User.findAll({    // returns an array of user objects
            where:
            {
                firstName: firstNames,
                lastName: lastNames
            }
        });
        const tripPassengersIds = tripPassengersNames.map(passenger => passenger.userId);   // returns an array of the users ids to be added as passengers
        const tripPassengersPromises = tripPassengersIds.map(async passengerId => {  // returns an array of promises for each TripPassengers entry
            return await TripPassengers.create({
                tripId: Trip.tripId,
                passengerId
            });
        });
        const newTripPassengers = await Promise.all(tripPassengersPromises);    // wait for all the promises to be resolved
        const allAddOperationsSuccessful = newTripPassengers.every(result => !result.isNewRecord); // check if all the passengers were added to the trip

        if(allAddOperationsSuccessful){
            Trip.passengers += tripPassengersPromises.length;
            await Trip.save();  // save the updated trip
        } else {
            throw new Error('Error adding passengers to trip!');
        } 
    }
}

const removePassengersFromTrip = async(passengers: passengerInterface[], Trip: Trip): Promise<void> => {
    if(passengers.length > 0){
        const firstNames = passengers.map(passenger => passenger.firstName);    // returns an array of first names of the passengers to be removed
        const lastNames = passengers.map(passenger => passenger.lastName);      // returns an array of last names of the passengers to be removed
        const tripPassengersNames = await User.findAll({    // returns an array of user objects
            where:
            {
                firstName: firstNames,
                lastName: lastNames
            }
        });
        const tripPassengersIds = tripPassengersNames.map(passenger => passenger.userId);   // returns an array of the users ids to be removed as passengers
        const tripPassengersPromises = tripPassengersIds.map(async passengerId => {  // returns an array of promises for each TripPassengers entry
            try {
                return await TripPassengers.destroy({
                    where: {
                        tripId: Trip.tripId,
                        passengerId
                    }
                });
            } catch (error) {
                console.log(`Error deleting passenger with id: ${passengerId}`, error);
                return 0;
            }
        });
        const removedTripPassengers = await Promise.all(tripPassengersPromises);    // wait for all the promises to be resolved
        const allRemoveOperationsSuccessful = removedTripPassengers.every(result => result > 0); // check if all the passengers were removed from the trip
        if(allRemoveOperationsSuccessful){
            Trip.passengers -= tripPassengersPromises.length;
            await Trip.save();  // save the updated trip 
        } else {
            throw new Error('Error removing passengers from trip!');
        }
    }
}

const addStopsToTrip = async(stops:stopLocInterface[], Trip: Trip): Promise<void> => {
    if(stops.length > 0){
        const stopRecords = await Stops.findAll({   // returns an array of stop objects
            where: {
                stopLoc: stops // returns only the names of the stops that are in the stops array
            }
        });
    
        const stopIds = stopRecords.map(stop => stop.stopId); // iterates over the array of stop objects and returns an array of their ids
    
        const tripStopsPromises = stopIds.map(async stopId => {   // create an array of promises for each TripsStop entry
            try {
                return await TripStops.create({
                    tripId: Trip.tripId,
                    stopId
                });
            } catch (error) {
                console.log(`Error adding stop with id: ${stopId}`, error);
                return {isNewRecord: false};
            }
        });
        // wait for all the promises to be resolved
        const newTripStops = await Promise.all(tripStopsPromises); 
        // console.log(newTripStops);
        const allAddOperationsSuccessful = newTripStops.every(result => result.isNewRecord); 
        // console.log(allAddOperationsSuccessful);
        if(allAddOperationsSuccessful){
            Trip.stops += tripStopsPromises.length;
            await Trip.save();  // save the updated trip
        } else {
            throw new Error('Error adding stops to trip!');
        }  
    }
}

const removeStopsFromTrip = async(stops: stopLocInterface[], Trip: Trip): Promise<void> => {
    if(stops.length > 0){
        const stopRecords = await Stops.findAll({   // returns an array of stop objects
            where: {
                stopLoc: stops // returns only the names of the stops that are in the stops array
            }
        });
    
        const stopIds = stopRecords.map(stop => stop.stopId); // iterates over the array of stop objects and returns an array of their ids
    
        const tripStopsPromises = stopIds.map(async stopId => {   // create an array of promises for each TripsStop entry
            try {
                return await TripStops.destroy({
                    where:  {
                        tripId: Trip.tripId,
                        stopId
                    }
                });
            } catch(error) {
                console.log(`Error deleting stop with id: ${stopId}`, error);
                return 0;
            }
        });
        // wait for all the promises to be resolved
        const removedTripStops = await Promise.all(tripStopsPromises);    
        const allRemoveOperationsSuccessful = removedTripStops.every(result => result > 0);
        if(allRemoveOperationsSuccessful){
            Trip.stops -= tripStopsPromises.length;
            await Trip.save();  // save the updated trip
        } else {
            throw new Error('Error removing stops from trip!');
        }
    }
}

const deleteTripPassengers = async (tripId: string): Promise<void> => {
    try {
        await TripPassengers.destroy({
            where: {
                tripId
            }
        });
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error deleting the trip's passengers: " + error);
        } else if (error instanceof Error){
            console.log(error.message); 
        }       
    }
}

const deleteTripStops = async(tripId: string): Promise<void> => {
    try {
        await TripStops.destroy({
            where: {
                tripId
            }
        });
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error deleting the trip's passengers: " + error);
        } else if (error instanceof Error){
            console.log(error.message); 
        }
    }
}

export const returnTrips = async (req: Request,res: Response): Promise<void> => {
    try {
        const trips = await Trip.findAll({
            include: [
                {
                    model: Driver,
                    as: 'driver',
                    include:[
                        {
                            model: User,
                            as: 'user',
                            attributes: ['firstName', 'lastName']
                        }
                    ]
                },
            ]
        });
        res.status(200).send(trips);
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error deleting the trip's passengers: " + error);
            res.status(500).send('Error retrieving trips: ' + error);
        } else if (error instanceof Error){
            console.log(error.message); 
            res.status(500).send('Error retrieving trips: ' + error.message);
        }
    }
}

export const returnSingleTrip = async (req: Request,res: Response): Promise<void> => {
    try {
        const TripId = req.params.id;
        const trip = await Trip.findByPk(TripId,{
            include: [
                {
                    model: Driver,
                    as: 'driver',
                },
                {
                    model: TripPassengers,
                    as: 'tripPassengers',
                    include: [
                        {
                            model: User,
                            as: 'passenger',
                            attributes: ['firstName', 'lastName']
                        }
                    ]
                },
                {
                    model: TripStops,
                    as: 'tripStops',
                    include: [
                        {
                            model: Stops,
                            as: 'stopLocation',
                            attributes: ['stopLoc']
                        }
                    ]
                }
            ]
        });
        res.status(200).send(trip);
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error deleting the trip's passengers: " + error);
            res.status(500).send('Error retrieving trips: ' + error);
        } else if (error instanceof Error){
            console.log(error.message); 
            res.status(500).send('Error retrieving trips: ' + error.message);
        }
    }
}

export const createTrip = async (req: Request,res: Response): Promise<void> => {
    const {userId, driverId, startLocation} = req.body;
    // check if the user is a driver and if yes insert the driverId in the trip table
    const currentUserId: number = userId;
    // const currentUserId = req.session.userId;    
    const currentUserIsDriver = await Driver.findOne({where: {driverId: currentUserId}});
    const finalDriverId = currentUserIsDriver === null ? driverId : currentUserId;  // if the user is a driver, the driverId is the same as the userId

    const stops: stopLocInterface[] = req.body.stops;

    const passengers: passengerInterface[] = req.body.passengers;

    const newTrip = await Trip.create({
        driverId: finalDriverId,
        tripCreatorId: userId,
        startLocation,
        tripDate: "2024-01-17",
        status: 'planning'  
    });

    await addStopsToTrip(stops, newTrip);
    await addPassengersToTrip(passengers, newTrip);

    res.status(200).send(newTrip);
}

export const updateTrip = async (req: Request,res: Response): Promise<void> => {
    // console.log(req.params.id);
    const tripId: string = req.params.id;  // take the value from the placeholder in the URL
    // const typeOfUser = req.user.role;
    const updateDetails: updateDetailsInterface = req.body; // {startLocation, tripDate}

    // const addPassengers = req.body.addPassengers;
    const removePassengers: passengerInterface[] = req.body.removePassengers;
    const addStops: stopLocInterface[] = req.body.addStops;
    const removeStops: stopLocInterface[] = req.body.removeStops;

    try {
        const trip = await Trip.findByPk(tripId);
        if(trip === null)
            throw new Error(`Trip with id ${tripId} not found!`);
        if(req.body.userId !== trip.tripCreatorId){ // only the user that created the trip can update it 
            // if(addPassengers){
            //     await addPassengersToTrip(addPassengers, tripId);
            // }
            if(removePassengers !== null){
                await removePassengersFromTrip(removePassengers, trip);
            }
            if(addStops !== null){
                await addStopsToTrip(addStops, trip);
            }
            if(removeStops !== null){
                await removeStopsFromTrip(removeStops, trip);
            }
        }
        await trip.update(updateDetails);
        res.status(200).json(trip);

    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error deleting the trip's passengers: " + error);
            res.status(500).send('Error retrieving trips: ' + error);
        } else if (error instanceof Error){
            console.log(error.message); 
            res.status(500).send('Error retrieving trips: ' + error.message);
        }
    }
}

export const deleteTrip = async (req: Request,res: Response): Promise<void> => {
    const tripId = req.params.id;
    // const userId = req.session.userId;
    const userId: number = req.body.userId;
    try {
        const trip = await Trip.findByPk(tripId);
        // console.log(trip);
        if(trip === null)
            throw new Error(`Trip with id ${tripId} not found!`);
        if(userId === trip.tripCreatorId){ // only the user that created the trip can delete it
            deleteTripStops(tripId).catch(error => {throw error});
            deleteTripPassengers(tripId).catch(error => {throw error});
            await trip.destroy();
            res.status(200).json({message: `Trip with id ${tripId} was deleted!`});
        } 
    } catch (error) {
        console.error(error);
        if(typeof error === 'string'){
            console.log("There was an error deleting the trip's passengers: " + error);
            res.status(500).send('Error retrieving trips: ' + error);
        } else if (error instanceof Error){
            console.log(error.message); 
            res.status(500).send('Error retrieving trips: ' + error.message);
        }
    }

}

export default {
    returnTrips,
    returnSingleTrip,
    createTrip,
    updateTrip,
    deleteTrip
}