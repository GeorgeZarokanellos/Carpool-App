const {DataTypes, Model} = require ('sequelize');
const sequelize = require('../database/connect_to_db');

class TripPassengers extends Model {}

TripPassengers.init({
    //fields
    tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'trip_id'
    },
    passengerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'passenger_id'
    },

}, {
    sequelize,
    modelName: 'trip_passengers',    //name of the model in the code
    tableName: 'trip_passengers',    //name of the table in the db
    timestamps: false,
});

module.exports = TripPassengers;