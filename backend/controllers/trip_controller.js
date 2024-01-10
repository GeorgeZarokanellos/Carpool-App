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
        const Trip = await Trip.findByPk(TripId,{
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
        })
    } catch (error) {
        res.status(500).send('Error retrieving trip:' + error);
    }
}

const createTrip = async (req,res) => {
    const {userId, driverId, startLocation, stops} = req.body;
    //check if the user is a driver and if yes insert the driverId in the trip table
    const currentUserId = userId;
    // const currentUserId = req.session.userId;    
    const currentUserIsDriver = await Driver.findOne({where: {driverId: currentUserId}});
    const finalDriverId = currentUserIsDriver ? currentUserId : driverId;

    const newTrip = await Trip.create({
        driverId: finalDriverId,
        tripCreatorId: userId,
        startLocation: startLocation,
        stops: stops,
        tripDate: Date.now(),
        status: 'planning'
    });
    
    res.status(200).send(newTrip);
}

module.exports = {
    returnTrips,
    returnSingleTrip,
    createTrip
}