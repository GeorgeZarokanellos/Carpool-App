import Trip from './trip';
import Stop from './stop';
import TripStop from './trip_stop';
import TripPassenger from './trip_passenger';
import User from './user';
import Driver from './driver';
import Review from './review';
import Vehicle from './vehicle';



TripPassenger.belongsTo(Trip, {foreignKey: 'tripId' , as: 'tripPassenger'});
Trip.hasMany(TripPassenger, {foreignKey: 'tripId', as: 'tripPassenger'});

TripPassenger.belongsTo(User, {foreignKey: 'passengerId', as: 'passenger'});

TripStop.belongsTo(Stop, {foreignKey: 'stopId', as: 'details'});

TripStop.belongsTo(Trip, {foreignKey: 'tripId', targetKey: 'tripId'});
Trip.hasMany(TripStop, {foreignKey: 'tripId', as: 'tripStops'});

Trip.belongsTo(Driver, {foreignKey: 'driverId', targetKey: 'driverId' ,as: 'driver'});
Trip.belongsTo(User, {foreignKey: 'tripCreatorId', targetKey: 'userId', as: 'tripCreator'});

Driver.belongsTo(User, {foreignKey: 'driverId', as: 'user'});

Driver.hasOne(Vehicle, {foreignKey: 'ownerId', as: 'vehicle'});
Vehicle.belongsTo(Driver, {foreignKey: 'driverId', as: 'driver'});

Review.belongsTo(User, {foreignKey: 'reviewerId', targetKey: 'userId', as: 'reviewer'});
User.hasMany(Review, {foreignKey: 'reviewerId', as: 'reviewer'});

export {
    User,
    Trip,
    TripStop,
    TripPassenger,
    Stop,
    Driver,
    Review
}

