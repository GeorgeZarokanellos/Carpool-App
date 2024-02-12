import Trip from './trip';
import Stops from './stop';
import TripStops from './trip_stops';
import TripPassengers from './trip_passengers';
import User from './user';
import Driver from './driver';
import Reviews from './reviews';



TripPassengers.belongsTo(Trip, {foreignKey: 'tripId', targetKey: 'tripId'});
TripPassengers.belongsTo(User, {foreignKey: 'passengerId', as: 'passenger'});

TripStops.belongsTo(Trip, {foreignKey: 'tripId', targetKey: 'tripId'});
TripStops.belongsTo(Stops, {foreignKey: 'stopId', as: 'stopLocation'});

Trip.hasMany(TripStops, {foreignKey: 'tripId', as: 'tripStops'});
Trip.hasMany(TripPassengers, {foreignKey: 'tripId', as: 'tripPassengers'});

Trip.belongsTo(Driver, {foreignKey: 'driverId', targetKey: 'driverId' ,as: 'driver'});
Trip.belongsTo(User, {foreignKey: 'tripCreatorId', targetKey: 'userId', as: 'tripCreator'});

Driver.belongsTo(User, {foreignKey: 'driverId', as: 'user'});

Reviews.belongsTo(User, {foreignKey: 'reviewerId', targetKey: 'userId', as: 'reviewer'});

User.hasMany(Reviews, {foreignKey: 'reviewedPersonId', as: 'reviews'});

export {
    User,
    Trip,
    TripStops,
    TripPassengers,
    Stops,
    Driver,
    Reviews
}

