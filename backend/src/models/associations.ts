import Trip from './trip';
import Stop from './stop';
import TripStop from './trip_stop';
import TripPassenger from './trip_passenger';
import User from './user';
import Driver from './driver';
import Review from './review';



TripPassenger.belongsTo(Trip, {foreignKey: 'tripId'});
TripPassenger.belongsTo(User, {foreignKey: 'passengerId', as: 'passenger'});

TripStop.belongsTo(Trip, {foreignKey: 'tripId', targetKey: 'tripId'});
TripStop.belongsTo(Stop, {foreignKey: 'stopId', as: 'stopLocation'});

Trip.hasMany(TripStop, {foreignKey: 'tripId', as: 'tripStop'});
Trip.hasMany(TripPassenger, {foreignKey: 'tripId', as: 'tripPassengers'});

Trip.belongsTo(Driver, {foreignKey: 'driverId', targetKey: 'driverId' ,as: 'driver'});
Trip.belongsTo(User, {foreignKey: 'tripCreatorId', targetKey: 'userId', as: 'tripCreator'});

Driver.belongsTo(User, {foreignKey: 'driverId', as: 'user'});

Review.belongsTo(User, {foreignKey: 'reviewerId', targetKey: 'userId', as: 'reviewer'});

User.hasMany(Review, {foreignKey: 'reviewedPersonId', as: 'reviewedPerson'});

export {
    User,
    Trip,
    TripStop,
    TripPassenger,
    Stop,
    Driver,
    Review
}

