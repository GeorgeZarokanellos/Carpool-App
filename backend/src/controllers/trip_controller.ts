import { type NextFunction, type Request, type Response } from 'express';
import { Trip, TripPassenger, TripStop, Stop, User, Driver } from '../models/associations';
import { type passengerInterface, type updateDetailsInterface } from '../interfaces/trip_interfaces';
import sequelize from '../database/connect_to_db';
import { type Transaction } from 'sequelize';


//#region private functions
/**
 * Adds passengers to a trip.
 * 
 * @param passengers - An array of passenger objects.
 * @param Trip - The trip object to which passengers will be added.
 * @param transaction - The transaction object for database operations.
 * @returns A promise that resolves to void.
 * @throws Error if one or more passengers were not found.
 */
const addPassengersToTrip = async(passengers: passengerInterface[], Trip: Trip, transaction: Transaction): Promise<void> => {
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
        console.log("trip passengers names: ", tripPassengersNames);
        if(tripPassengersNames.length !== passengers.length)
            throw new Error('One or more passengers were not found!');
        const tripPassengersIds = tripPassengersNames.map(passenger => passenger.userId);   // returns an array of the users ids to be added as passengers
        console.log("trip passenger ids: ", tripPassengersIds);
        
        const tripPassengersAddPromises = tripPassengersIds.map(async passengerId => {  // returns an array of promises for each TripPassenger entry
            return await TripPassenger.create({
                tripId: Trip.tripId,
                passengerId
            },{transaction});
        });
        console.log("trip passenger promises:", tripPassengersAddPromises);
        
        await Promise.all(tripPassengersAddPromises);    // wait for all the promises to be resolved
        Trip.passengers += tripPassengersAddPromises.length;
        await Trip.save({transaction});  // save the updated trip
        } 
}   

const removePassengersFromTrip = async(passengers: passengerInterface[], Trip: Trip, transaction: Transaction): Promise<void> => {
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
        const tripPassengersDeletePromises = tripPassengersIds.map(async passengerId => {  // returns an array of promises for each TripPassenger entry
                return await TripPassenger.destroy({
                    where: {
                        tripId: Trip.tripId,
                        passengerId
                    },
                    transaction
                });
        });
        await Promise.all(tripPassengersDeletePromises);    // wait for all the promises to be resolved
        Trip.passengers -= tripPassengersDeletePromises.length;
        await Trip.save({transaction});  // save the updated trip 
    }
}

/**
 * Adds stops to a trip.
 * 
 * @param stops - An array of stop names.
 * @param Trip - The trip object to add stops to.
 * @param transaction - The transaction object for database operations.
 * @returns A promise that resolves to void.
 * @throws Error if one or more stops were not found.
 */
const addStopsToTrip = async(stops: string[], Trip: Trip, transaction: Transaction): Promise<void> => {
    if(stops.length > 0){
        const stopRecords = await Stop.findAll({   // returns an array of stop objects
            where: {
                stopLoc: stops // returns only the names of the stops that are in the stops array
            }
        });
        console.log("stop records: ",stopRecords);
        if(stopRecords.length !== stops.length)
            throw new Error('One or more stops were not found!');
        const stopIds = stopRecords.map(stop => stop.stopId); // iterates over the array of stop objects and returns an array of their ids
        console.log("stop ids: ", stopIds);
        
        const tripStopAddPromises = stopIds.map(async stopId => {   // create an array of promises for each TripsStop entry
                return await TripStop.create({
                    tripId: Trip.tripId,
                    stopId
                },{transaction});
        });
        console.log("trip stop promises:", tripStopAddPromises);
        
        // wait for all the promises to be resolved
        await Promise.all(tripStopAddPromises); 
        Trip.stops += tripStopAddPromises.length;
        await Trip.save({transaction});  // include the changes to the trip in the transaction
    }
      
}

const removeStopsFromTrip = async(stops: string[], Trip: Trip, transaction: Transaction): Promise<void> => {
    console.log(stops);
    // console.log('anything');
    if(stops.length > 0){
        const stopRecords = await Stop.findAll({   // returns an array of stop objects
            where: {
                stopLoc: stops // returns only the names of the stops that are in the stops array
            }
        });
    
        const stopIds = stopRecords.map(stop => stop.stopId); // iterates over the array of stop objects and returns an array of their ids
    
        const tripStopDeletePromises = stopIds.map(async stopId => {   // create an array of promises for each TripsStop entry
                return await TripStop.destroy({
                    where:  {
                        tripId: Trip.tripId,
                        stopId
                    },
                    transaction
                });
            
        });
        // wait for all the promises to be resolved
        await Promise.all(tripStopDeletePromises);    
        Trip.stops -= tripStopDeletePromises.length;
        await Trip.save({transaction});  // include the changes to the trip in the transaction
        
    }
}

/**
 * Deletes all trip passengers associated with the given trip ID.
 * 
 * @param tripId - The ID of the trip.
 * @param transaction - The transaction object for the database operation.
 * @returns A Promise that resolves to void.
 */
const deleteTripPassengers = async (tripId: string, transaction: Transaction): Promise<void> => {
    await TripPassenger.destroy({
        where: {
            tripId
        },
        transaction
    });
    
}

const deleteTripStop = async (tripId: string, transaction: Transaction): Promise<void> => {
    await TripStop.destroy({
        where: {
            tripId
        },
        transaction
    });      
}
//#endregion

// #region public crud functions
export const returnTrips = (req: Request,res: Response, next: NextFunction): void => {
    async function returnTripsAsync(): Promise<void> {
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
                // console.log("There was an error retrieving the trips: " + error);
                res.status(500).send('Error retrieving trips: ' + error);
            } else if (error instanceof Error){
                console.log(error.message); 
                res.status(500).send('Error retrieving trips: ' + error.message);
            }
        }
    };
    returnTripsAsync().catch(next);
}

export const returnSingleTrip = (req: Request,res: Response, next: NextFunction): void => {
    async function returnSingleTripAsync(): Promise<void> {
        try {
            const TripId = req.params.id;
            // console.log(TripId);
            const trip = await Trip.findByPk(TripId,{
                include: [
                    {
                        model: Driver,
                        as: 'driver',
                    },
                    {
                        model: TripPassenger,
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
                        model: TripStop,
                        as: 'tripStop',
                        include: [
                            {
                                model: Stop,
                                as: 'stopLocation',
                                attributes: ['loc']
                            }
                        ]
                    }
                ]
            });
            if(trip === null)
                throw new Error(`Trip with id ${TripId} not found!`);
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
    };
    returnSingleTripAsync().catch(next);
}

export const createTrip = (req: Request,res: Response, next: NextFunction): void => {
    async function createTripAsync(): Promise<void> {
        await sequelize.transaction(async (transaction: Transaction) => { 
            const {userId, driverId, startLocation} = req.body;
            // check if the user is a driver and if yes insert the driverId in the trip table
            const currentUserId: number = userId;
            // const currentUserId = req.session.userId;    
            const currentUserIsDriver = await Driver.findOne({
                where: {
                    driverId: currentUserId
                }
            });
            const finalDriverId = currentUserIsDriver === null ? driverId : currentUserId;  // if the user is a driver, the driverId is the same as the userId
            const stops: string[] = req.body.stops;
            const passengers: passengerInterface[] = req.body.passengers;

            const newTrip = await Trip.create({
                driverId: finalDriverId,
                tripCreatorId: userId,
                startLocation,
                tripDate: "2024-01-17",
                status: 'planning'  
            },{transaction});

            await addStopsToTrip(stops, newTrip, transaction);
            await addPassengersToTrip(passengers, newTrip, transaction);
            await newTrip.save({transaction});

            res.status(200).send(newTrip);
        }).catch((err) => {
            console.error(err);
            if(typeof err === 'string'){
                console.log("There was an error creating the trip: " + err);
                res.status(500).send('Error creating trip: ' + err);
            } else if (err instanceof Error){
                console.log(err.message); 
                res.status(500).send('Error creating trip: ' + err.message);
            }
        });
    };
    createTripAsync().catch(next);
}   

export const updateTrip = (req: Request,res: Response, next: NextFunction): void => {
        async function updateTripAsync(): Promise<void> {
            await sequelize.transaction(async (transaction: Transaction) => {
                // console.log(req.params.id);
            const tripId: string = req.params.id;  // take the value from the placeholder in the URL
            // const typeOfUser = req.user.role;
            const updateDetails: updateDetailsInterface = req.body; // {startLocation, tripDate}

            // const addPassengers = req.body.addPassengers;
            const removePassengers: passengerInterface[] = req.body.removePassengers;
            // console.log(req.body.removePassengers);
            // console.log(removePassengers);
            
            
            const addStops: string[] = req.body.addStops;
            // console.log(addStops);
            
            const removeStops: string[] = req.body.removeStops;
            // console.log(req.body.removeStops);
            // console.log(removeStops);
            
            const trip = await Trip.findByPk(tripId);
            if(trip === null)
                throw new Error(`Trip with id ${tripId} not found!`);
            // console.log(req.body.userId + " " + trip.tripCreatorId);
            
            if(req.body.userId === trip.tripCreatorId){ // only the user that created the trip can update it 
                // if(addPassengers){
                //     await addPassengersToTrip(addPassengers, tripId);
                // }
                if(removePassengers !== null && removePassengers !== undefined){
                    // console.log("remove passengers if: ", removePassengers);
                    await removePassengersFromTrip(removePassengers, trip, transaction);
                }
                if(addStops !== null && addStops !== undefined){
                    // console.log("add stops if: ", addStops);
                    await addStopsToTrip(addStops, trip, transaction);
                }
                if(removeStops !== null && removeStops !== undefined){
                    // console.log("remove stops if: ", removeStops);
                    await removeStopsFromTrip(removeStops, trip, transaction);
                }
            }
            await trip.update(updateDetails, {transaction});    // update the trip with the new details and include the changes in the transaction
            res.status(200).json(trip);
            }).catch((err) => {
                console.error(err);
                if(typeof err === 'string'){
                    console.log("There was an error updating the trip: " + err);
                    res.status(500).send('Error updating trip: ' + err);
                } else if (err instanceof Error){
                    console.log(err.message); 
                    res.status(500).send('Error updating trip: ' + err.message);
                }
            });
    };
    updateTripAsync().catch(next);
}   

export const deleteTrip = (req: Request,res: Response, next: NextFunction): void =>{
    async function deleteTripAsync(): Promise<void> {
        await sequelize.transaction(async (transaction: Transaction) => {
            const tripId = req.params.id;
            // const userId = req.session.userId;
            const userId: number = req.body.userId;
                const trip = await Trip.findByPk(tripId);
                // console.log(trip);
                if(trip === null)
                    throw new Error(`Trip with id ${tripId} not found!`);
                if(userId === trip.tripCreatorId){ // only the user that created the trip can delete it
                    await deleteTripStop(tripId, transaction);
                    await deleteTripPassengers(tripId, transaction);
                    await trip.destroy({transaction});
                    res.status(200).json({message: `Trip with id ${tripId} was deleted!`});
                } 
            }).catch((err) => {
                console.error(err);
                if(typeof err === 'string'){
                    console.log("There was an error deleting the trip: " + err);
                    res.status(500).send('Error deleting trip: ' + err);
                } else if (err instanceof Error){
                    console.log(err.message); 
                    res.status(500).send('Error deleting trip: ' + err.message);
                }
            });
    };
    deleteTripAsync().catch(next);
}
// #endregion

