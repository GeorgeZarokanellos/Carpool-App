const {DataTypes, Model} = require ('sequelize');
const sequelize = require('../database/connect_to_db'); //import the connection instance
const trip = require('./trip');
const stop = require('./stop');


class TripStops extends Model {}

TripStops.init({
    //fields
    tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'trip_id'
    },
    stopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'stop_id'
    },

}, {
    sequelize,
    modelName: 'trip_stops',    //name of the model in the code
    tableName: 'trip_stops',    //name of the table in the db
    timestamps: false,
});

TripStops.belongsTo(trip, {foreignKey: 'tripId'});
TripStops.belongsTo(stop, {foreignKey: 'stopId'});

module.exports = TripStops;