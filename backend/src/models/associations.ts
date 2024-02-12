import Trip from './trip';
import Stops from './stop';
import TripStops from './trip_stops';
import TripPassengers from './trip_passengers';
import User from './user';
import Driver from './driver';
import Reviews from './reviews';



TripPassengers.belongsTo(Trip, {foreignKey: 'tripId', as: 'trip'});
TripPassengers.belongsTo(User, {foreignKey: 'passengerId', as: 'passenger'});

TripStops.belongsTo(Trip, {foreignKey: 'tripId'});
TripStops.belongsTo(Stops, {foreignKey: 'stopId', as: 'stopLocation'});

Trip.hasMany(TripStops, {foreignKey: 'tripId', as: 'tripStops'});
Trip.hasMany(TripPassengers, {foreignKey: 'tripId', as: 'tripPassengers'});

Trip.belongsTo(Driver, {foreignKey: 'driverId', as: 'driver'});
Trip.belongsTo(User, {foreignKey: 'tripCreatorId', as: 'tripCreator'});

Driver.belongsTo(User, {foreignKey: 'driverId', as: 'user'});

Reviews.belongsTo(User, {foreignKey: 'reviewerId'});

User.hasMany(Reviews, {foreignKey: 'reviewedPersonId', as: 'reviews'});

export {
    Trip,
    TripStops,
    TripPassengers,
    Stops,
    Driver,
    Reviews
}

export default User;