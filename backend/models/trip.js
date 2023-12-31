const {DataTypes, Model} = require ('sequelize');
const sequelize = require('../database/connect_to_db'); //import the connection instance

class Trip extends Model {}

Trip.init({
    //fields
    tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'trip_id'
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'driver_id'
    },
    startLocation: {
        type: DataTypes.ENUM,
        values: ['Plateia Gewrgiou', 'Plateia Olgas', 'Pyrosvesteio', 'Aretha'],
        allowNull: false,
        field: 'start_loc'
    },
    stops: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'stops'
    },
    tripDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'date'
    },
},
{
    sequelize,
    modelName: 'trip',
    tableName: 'trip',
    timestamps: false, 
})

module.exports = Trip;