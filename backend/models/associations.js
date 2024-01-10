const Trip = require('./trip');
const Stops = require('./stop');
const TripStops = require('./trip_stops');
const TripPassengers = require('./trip_passengers');
const User = require('./user');
const Driver = require('./driver');



TripPassengers.belongsTo(Trip, {foreignKey: 'tripId', as: 'trip'});
TripPassengers.belongsTo(User, {foreignKey: 'passengerId', as: 'passenger'});

TripStops.belongsTo(Trip, {foreignKey: 'tripId'});
TripStops.belongsTo(Stops, {foreignKey: 'stopId', as: 'stopLocation'});

Trip.hasMany(TripStops, {foreignKey: 'tripId', as: 'tripStops'});
Trip.hasMany(TripPassengers, {foreignKey: 'tripId', as: 'tripPassengers'});

Trip.belongsTo(Driver, {foreignKey: 'driverId', as: 'driver'});
Trip.belongsTo(User, {foreignKey: 'tripCreatorId', as: 'tripCreator'});

Driver.belongsTo(User, {foreignKey: 'driverId', as: 'user'});



module.exports = {
    Trip,
    TripStops,
    TripPassengers,
    Stops,
    User,
    Driver
}