const {DataTypes, Model} = require ('sequelize');
const sequelize = require('../database/connect_to_db'); //import the connection instance


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


module.exports = TripStops;