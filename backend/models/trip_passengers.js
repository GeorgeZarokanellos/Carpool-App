const {DataTypes, Model} = require ('sequelize');
const sequelize = require('../database/connect_to_db');
const trip = require('./trip');
const user = require('./user');

class TripPassengers extends Model {}

TripPassengers.init({
    //fields
    tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'trip_id'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'user_id'
    },

}, {
    sequelize,
    modelName: 'trip_passengers',    //name of the model in the code
    tableName: 'trip_passengers',    //name of the table in the db
    timestamps: false,
});

TripPassengers.belongsTo(trip, {foreignKey: 'tripId'});
TripPassengers.belongsTo(user, {foreignKey: 'userId'});

module.exports = TripPassengers;