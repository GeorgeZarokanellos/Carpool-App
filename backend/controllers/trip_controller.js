const {Trip, TripPassengers, TripStops, Stops, User, Driver} = require('../models/associations');

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

    const stopRecords = await Stops.findAll({   //returns an array of stop objects
        where: {
            stopLoc: stops //returns only the names of the stops that are in the stops array
        }
    });

    const stopIds = stopRecords.map(stop => stop.stopId); //iterates over the array of stop objects and returns an array of their ids

    const tripStopsPromises = stopIds.map(stopId => {   //create an array of promises for each TripsStop entry
        return TripStops.create({
            tripId: newTrip.tripId,
            stopId: stopId
        });
    });
    //wait for all the promises to be resolved
    const newTripStops = await Promise.all(tripStopsPromises);

    const firstNames = passengers.map(passenger => passenger.firstName);
    const lastNames = passengers.map(passenger => passenger.lastName);
    const tripPassengersNames = await User.findAll({
        where: {
            firstName: firstNames,
            lastName: lastNames
        }
    });
    const tripPassengersIds = tripPassengersNames.map(passenger => passenger.userId);
    const tripPassengersPromises = tripPassengersIds.map(passengerId => {
        return TripPassengers.create({
            tripId: newTrip.tripId,
            passengerId: passengerId
        });
    });
    const newTripPassengers = await Promise.all(tripPassengersPromises);

    res.status(200).send(newTrip);
}

const updateTrip = async (req,res) => {
    const tripId = req.params.id;  //take the value from the placeholder in the URL
    const updateDetails = req.body; // {startLocation, stops, status}
    try {
        const trip = await Trip.findByPk(tripId);
        if(!trip)
            throw  new Error(`Trip with id ${tripId} not found!`);
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