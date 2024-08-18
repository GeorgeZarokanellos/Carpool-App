import { type NextFunction, type Request, type Response } from 'express';
import { Trip, TripPassenger, TripStop, Stop, User, Driver } from '../model/association';
import { type passengerInterface, type updatedTripInterface , type tripInterface } from '../interface/interface';
import sequelize from '../database/connect_to_db';
import { Op, type Transaction } from 'sequelize';
import logger from '../util/winston';
import Vehicle from '../model/vehicle';
import { parse } from 'date-fns';

// #region public crud functions
export const returnTrips = (req: Request,res: Response, next: NextFunction): void => {
    async function returnTripsAsync(): Promise<void> {
        const userDateTime = req.query.userDate as string;
        console.log(userDateTime);
        const modifiedDateTime = userDateTime.replace('μ.μ.', 'PM');
        console.log(modifiedDateTime);
        const parsedDate = parse(modifiedDateTime, 'M/d/yyyy, h:mm:ss a', new Date());
        console.log(parsedDate);
        
        
        try {
            const trips = await Trip.findAll({
                where: {
                    startingTime: {
                        [Op.gt]: parsedDate
                    }
                },
                include: [
                    {
                        model: Driver,
                        as: 'driver',
                        include:[
                            {
                                model: User,
                                as: 'user',
                                attributes: ['firstName', 'lastName', 'overallRating']
                            },
                            {
                                model: Vehicle,
                                as: 'vehicle',
                                attributes: ['noOfSeats', 'maker', 'model']
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'tripCreator',
                        foreignKey: 'tripCreatorId',
                        attributes: ['firstName', 'lastName']
                    }
                ]
            });
            // console.log(trips);
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
                        model: User,
                        as: 'tripCreator',
                        attributes: ['firstName','lastName'],

                    },
                    {
                        model: Driver,
                        as: 'driver',
                        attributes: ['licenseId'],
                        include:[
                            {
                                model: User,
                                as: 'user',
                                attributes: ['firstName', 'lastName', 'overallRating', 'profilePicture']
                            },
                            {
                                model: Vehicle,
                                as: 'vehicle',
                                
                                attributes: ['noOfSeats']
                            }
                        ]
                    },
                    {
                        model: TripPassenger,
                        as: 'tripPassengers',
                        attributes: ['passengerId'],
                        include: [
                            {
                                model: User,
                                as: 'passenger',
                                attributes: ['firstName', 'lastName', 'overallRating', 'profilePicture']
                            },
                        ]
                    },
                    {
                        model: TripStop,
                        as: 'tripStops',
                        attributes: ['stopId'],
                        include: [
                            {
                                model: Stop,
                                as: 'details',
                                attributes: ['stopLocation', 'lat', 'lng']
                            }
                        ]
                    }
                ]
            });
            if(trip === null)
                throw new Error(`Trip with id ${TripId} not found!`);
            console.log(trip);  
            
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

export const createTrip = async(req: Request,res: Response, next: NextFunction): Promise<void> => {
    await sequelize.transaction(async (transaction: Transaction) => {
        console.log(req.body); 
        const {tripCreatorId, driverId, startLocation, startingTime}: tripInterface = req.body;
        const stops: number[] = req.body.stops;
        const passengers: passengerInterface[] = req.body.passengers;
        
        //TODO uncomment below line to test session when ready
        // const currentUserId = req.session.userId;  
   
        const newTrip = await Trip.create({
            tripCreatorId,
            driverId,
            startLocation,
            startingTime,
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

export const updateTrip = async(req: Request,res: Response, next: NextFunction): Promise<void> => {
    await sequelize.transaction(async (transaction: Transaction) => {
        const tripId: string = req.params.id;  
        const updateDetails: updatedTripInterface = req.body;   
        const trip = await Trip.findByPk(tripId);
        if(trip === null)
            throw new Error(`Trip with id ${tripId} not found!`);
        // console.log(req.body.userId + " " + trip.tripCreatorId);

        if(req.body.userId === trip.driverId){ 
            if(updateDetails.addPassengers !== null && updateDetails.addPassengers !== undefined){``
                await addPassengersToTrip(updateDetails.addPassengers, trip ,transaction);
            }
            if(updateDetails.removePassengers !== null && updateDetails.removePassengers !== undefined){
                // console.log("remove passengers if: ", removePassengers);
                await removePassengersFromTrip(updateDetails.removePassengers, trip, transaction);
            }
            if(updateDetails.addStops !== null && updateDetails.addStops !== undefined){
                // console.log("add stops if: ", addStops);
                await addStopsToTrip(updateDetails.addStops, trip, transaction);
            }
            if(updateDetails.removeStops !== null && updateDetails.removeStops !== undefined){
                // console.log("remove stops if: ", removeStops);
                await removeStopsFromTrip(updateDetails.removeStops, trip, transaction);
            }
        }
        await trip.update(updateDetails, {transaction});    // update the trip with the new details and include the changes in the transaction
        res.status(200).json({
            message: `Trip with id ${tripId} was updated!`,
            trip: trip
        });
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
}   

export const deleteTrip = async(req: Request,res: Response, next: NextFunction): Promise<void> =>{
    await sequelize.transaction(async (transaction: Transaction) => {
        const tripId = req.params.id;
        //TODO uncomment below line to test session when ready
        // const userId = req.session.userId;
        const userId: number = req.body.userId;
            const trip = await Trip.findByPk(tripId);
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
}
// #endregion

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
        logger.info("passengers: ", passengers, "from addPassengersToTrip");
        const firstNames = passengers.map(passenger => passenger.firstName);    // returns an array of first names of the passengers to be added
        const lastNames = passengers.map(passenger => passenger.lastName);      // returns an array of last names of the passengers to be added
        const usersToBeAdded = await User.findAll({    // returns an array of user objects
            where:
            {
                firstName: firstNames,
                lastName: lastNames
            }
        });
        logger.info("trip passengers names: ", usersToBeAdded);
        if(usersToBeAdded.length !== passengers.length)
            throw new Error('One or more passengers were not found!');
        const userIdsToAdd = usersToBeAdded.map(passenger => passenger.userId);   // returns an array of the users ids to be added as passengers
        logger.info("trip passengers ids: ", userIdsToAdd);        
        const tripPassengersAddPromises = userIdsToAdd.map(async passengerId => {  // returns an array of promises for each TripPassenger entry
            return await TripPassenger.create({
                tripId: Trip.tripId,
                passengerId
            },{transaction});
        });
        const updateCurrentTripIdPromises = userIdsToAdd.map(async passengerId => {
            return await User.update({
                currentTripId: Trip.tripId
            },{where: {userId: passengerId}, transaction});
        });
        const allPromises = [...tripPassengersAddPromises, ...updateCurrentTripIdPromises];
        await Promise.all(allPromises);    // wait for all the promises to be resolved
        logger.debug("trip: " , Trip, "tripPassengersIds: ", userIdsToAdd);
        logger.debug("trip passengers: ", Trip.noOfPassengers, "tripPassengersIds.length: ", userIdsToAdd.length);
        Trip.noOfPassengers += userIdsToAdd.length;
        logger.debug("trip passengers: ", Trip.noOfPassengers);
        await Trip.save({transaction});  // save the updated trip
    } 
}   

/**
 * Removes passengers from a trip.
 * 
 * @param passengers - An array of passenger objects.
 * @param Trip - The trip object from which passengers will be removed.
 * @param transaction - The transaction object for database operations.
 * @returns A promise that resolves to void.
 */
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
        Trip.noOfPassengers -= tripPassengersDeletePromises.length;
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
const addStopsToTrip = async(stops: number[], Trip: Trip, transaction: Transaction): Promise<void> => {
    if(stops.length > 0){
        logger.debug("stops: ", stops, "from addStopsToTrip");
        const stopRecords = await Stop.findAll({   // returns an array of stop objects
            where: {
                stopId: stops,  
            },
            attributes: ['stopId']
        });
        console.log("stop records: ", stopRecords);
        if(stopRecords.length !== stops.length)
            throw new Error('One or more stops were not found!');
        // const tripStopIds = stopRecords.map(stop => stop.stopId); // iterates over the array of stop objects and returns an array of their ids
        // logger.debug("trip stop ids: ", tripStopIds);
        
        const tripStopAddPromises = stopRecords.map(async stop => {   // create an array of promises for each TripsStop entry
                return await TripStop.create({
                    tripId: Trip.tripId,
                    stopId: stop.stopId
                },{transaction});
        });
        
        // wait for all the promises to be resolved
        await Promise.all(tripStopAddPromises);
        logger.debug("trip: " , Trip);
        // logger.debug("trip stops: ", Trip.noOfStops, "tripStopIds.length: ", tripStopIds.length); 
        Trip.noOfStops += stopRecords.length;
        logger.debug("trip stops: ", Trip.noOfStops);
        await Trip.save({transaction});  // include the changes to the trip in the transaction
    }
      
}

/**
 * Removes stops from a trip.
 * 
 * @param stops - An array of stop names to be removed from the trip.
 * @param Trip - The trip object from which the stops will be removed.
 * @param transaction - The transaction object for the database operation.
 * @returns A promise that resolves to void.
 */
const removeStopsFromTrip = async(stops: number[], Trip: Trip, transaction: Transaction): Promise<void> => {
    logger.debug("stops: ", stops, "from removeStopsFromTrip");
    if(stops.length > 0){
        const stopRecords = await Stop.findAll({   // returns an array of stop objects
            where: {
                stopId: stops // returns the stops whose ids are in the stops array
            }
        });
    
        const tripStopDeletePromises = stopRecords.map(async stop => {   // create an array of promises for each TripsStop entry
                return await TripStop.destroy({
                    where:  {
                        tripId: Trip.tripId,
                        stopId: stop.stopId
                    },
                    transaction
                });
            
        });
        // wait for all the promises to be resolved
        await Promise.all(tripStopDeletePromises);    
        Trip.noOfStops -= tripStopDeletePromises.length;
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

/**
 * Deletes all trip stops associated with a given trip ID.
 * 
 * @param tripId - The ID of the trip.
 * @param transaction - The transaction object for database operations.
 * @returns A promise that resolves when the trip stops are deleted.
 */
const deleteTripStop = async (tripId: string, transaction: Transaction): Promise<void> => {
    await TripStop.destroy({
        where: {
            tripId
        },
        transaction
    });      
}

export const retrieveAllStartingLocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stops = await Stop.findAll();
        console.log(stops);
        
        res.status(200).send(stops);
    } catch (error) {
        console.error(error);
            if(typeof error === 'string'){
                // console.log("There was an error retrieving the stops: " + error);
                res.status(500).send('Error retrieving stops: ' + error);
            } else if (error instanceof Error){
                console.log(error.message); 
                res.status(500).send('Error retrieving stops: ' + error.message);
            }
    }
}
//#endregion