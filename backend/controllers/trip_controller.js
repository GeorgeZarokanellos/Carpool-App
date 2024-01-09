const sequelize = require('../database/connect_to_db');
const {Trip, TripPassengers, TripStops, Stops, User, Driver} = require('../models/associations');

const displayTrips = async (req,res) => {
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

const displaySingleTrip = async (req,res) => {
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
    const {driverId, startLocation, stops} = req.body;
    
    const newTrip = await Trip.create({
        driverId: driverId,
        tripCreatorId: req.user.userId,
        startLocation: startLocation,
        stops: stops,
        tripDate: Date.now(),
        status: 'active'
    });
    
    res.status(200).send(newTrip);
}

module.exports = {
    displayTrips,
    displaySingleTrip,
    createTrip
}