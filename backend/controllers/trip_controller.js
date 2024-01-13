const {Trip, TripPassengers, TripStops, Stops, User, Driver} = require('../models/associations');

const addPassengersToTrip = async(passengers, tripId) => {
    if(passengers){
        const firstNames = passengers.map(passenger => passenger.firstName);    //returns an array of first names of the passengers to be added
        const lastNames = passengers.map(passenger => passenger.lastName);      //returns an array of last names of the passengers to be added
        const tripPassengersNames = await User.findAll({    //returns an array of user objects
            where:
            {
                firstName: firstNames,
                lastName: lastNames
            }
        });
        const tripPassengersIds = tripPassengersNames.map(passenger => passenger.userId);   //returns an array of the users ids to be added as passengers
        const tripPassengersPromises = tripPassengersIds.map(passengerId => {  //returns an array of promises for each TripPassengers entry
            return TripPassengers.create({
                tripId: tripId,
                passengerId: passengerId
            });
        });
        const newTripPassengers = await Promise.all(tripPassengersPromises);    //wait for all the promises to be resolved
        const allAddOperationsSuccessful = newTripPassengers.every(result => result.success); //check if all the passengers were added to the trip

        if(allAddOperationsSuccessful){
            Trip.passengers += tripPassengersPromises.length;
            await Trip.save();  //save the updated trip
        } else {
            throw new Error('Error adding passengers to trip!');
        } 
    }
}

const removePassengersFromTrip = async(passengers, tripId) => {
    if(passengers){
        const firstNames = passengers.map(passenger => passenger.firstName);    //returns an array of first names of the passengers to be removed
        const lastNames = passengers.map(passenger => passenger.lastName);      //returns an array of last names of the passengers to be removed
        const tripPassengersNames = await User.findAll({    //returns an array of user objects
            where:
            {
                firstName: firstNames,
                lastName: lastNames
            }
        });
        const tripPassengersIds = tripPassengersNames.map(passenger => passenger.userId);   //returns an array of the users ids to be removed as passengers
        const tripPassengersPromises = tripPassengersIds.map(passengerId => {  //returns an array of promises for each TripPassengers entry
            return TripPassengers.destroy({
                where: {
                    tripId: tripId,
                    passengerId: passengerId
                }
            });
        });
        const removedTripPassengers = await Promise.all(tripPassengersPromises);    //wait for all the promises to be resolved
        const allRemoveOperationsSuccessful = await removedTripPassengers.every(result => result.success);
        if(allRemoveOperationsSuccessful){
            Trip.passengers -= tripPassengersPromises.length;
            await Trip.save();  //save the updated trip 
        } else {
            throw new Error('Error removing passengers from trip!');
        }
    }
}

const addStopsToTrip = async(stops, tripId) => {
    if(stops){
        const stopRecords = await Stops.findAll({   //returns an array of stop objects
            where: {
                stopLoc: stops //returns only the names of the stops that are in the stops array
            }
        });
    
        const stopIds = stopRecords.map(stop => stop.stopId); //iterates over the array of stop objects and returns an array of their ids
    
        const tripStopsPromises = stopIds.map(stopId => {   //create an array of promises for each TripsStop entry
            return TripStops.create({
                tripId: tripId,
                stopId: stopId
            });
        });
        //wait for all the promises to be resolved
        const newTripStops = await Promise.all(tripStopsPromises); 
        const allAddOperationsSuccessful = newTripStops.every(result => result.success); 
        if(allAddOperationsSuccessful){
            Trip.stops += tripStopsPromises.length;
            await Trip.save();  //save the updated trip
        } else {
            throw new Error('Error adding stops to trip!');
        }  
    }
}

const removeStopsFromTrip = async(stops, tripId) => {
    if(stops){
        const stopRecords = await Stops.findAll({   //returns an array of stop objects
            where: {
                stopLoc: stops //returns only the names of the stops that are in the stops array
            }
        });
    
        const stopIds = stopRecords.map(stop => stop.stopId); //iterates over the array of stop objects and returns an array of their ids
    
        const tripStopsPromises = stopIds.map(stopId => {   //create an array of promises for each TripsStop entry
            return TripStops.destroy({
                where: {
                    tripId: tripId,
                    stopId: stopId
                }
            });
        });
        //wait for all the promises to be resolved
        const removedTripStops = await Promise.all(tripStopsPromises);    
        const allRemoveOperationsSuccessful = removedTripStops.every(result => result.success);
        if(allRemoveOperationsSuccessful){
            Trip.stops -= tripStopsPromises.length;
            await Trip.save();  //save the updated trip
        } else {
            throw new Error('Error removing stops from trip!');
        }
    }
}

const returnTrips = async (req,res) => {
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
        res.status(500).send('Error retrieving trips:' + error);
    }
}

const returnSingleTrip = async (req,res) => {
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
        res.status(500).send('Error retrieving trip:' + error);
    }
}

const createTrip = async (req,res) => {
    const {userId, driverId, startLocation} = req.body;
    //check if the user is a driver and if yes insert the driverId in the trip table
    const currentUserId = userId;
    // const currentUserId = req.session.userId;    
    const currentUserIsDriver = await Driver.findOne({where: {driverId: currentUserId}});
    const finalDriverId = currentUserIsDriver ? currentUserId : driverId;

    const stops = req.body.stops;
    const numberOfStops = stops.length;

    const passengers = req.body.passengers;
    const numberOfPassengers = passengers.length;

    const newTrip = await Trip.create({
        driverId: finalDriverId,
        tripCreatorId: userId,
        startLocation: startLocation,
        stops: numberOfStops,
        passengers: numberOfPassengers,
        tripDate: Date.now(),
        status: 'planning'
    });

    await addStopsToTrip(stops, newTrip.tripId);
    await addPassengersToTrip(passengers, newTrip.tripId);

    res.status(200).send(newTrip);
}

const updateTrip = async (req,res) => {
    const tripId = req.params.id;  //take the value from the placeholder in the URL
    const typeOfUser = req.user.role;
    const updateDetails = req.body; // {startLocation, tripDate}

    const addPassengers = req.body.addPassengers;
    const removePassengers = req.body.removePassengers;
    const addStops = req.body.addStops;
    const removeStops = req.body.removeStops;

    try {
        const trip = await Trip.findByPk(tripId);
        if(!trip)
            throw new Error(`Trip with id ${tripId} not found!`);
        if(req.user.userId !== trip.tripCreatorId){
            // if(addPassengers){
            //     await addPassengersToTrip(addPassengers, tripId);
            // }
            if(removePassengers){
                await removePassengersFromTrip(removePassengers, tripId);
            }
            if(addStops){
                await addStopsToTrip(addStops, tripId);
            }
            if(removeStops){
                await removeStopsFromTrip(removeStops, tripId);
            }
        }
        await trip.update(updateDetails);
        return res.status(200).json(trip);

    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred: ' + error);
    }
}

module.exports = {
    returnTrips,
    returnSingleTrip,
    createTrip,
    updateTrip
}