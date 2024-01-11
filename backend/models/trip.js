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
    tripCreatorId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'trip_creator_id'
    },
    driverId: {
        type: DataTypes.INTEGER,
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
    passengers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'passengers'
    },
    tripDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'date'
    },
    status: {
        type: DataTypes.ENUM,
        values: ['planning', 'locked', 'in_progress', 'completed', 'cancelled'],
        defaultValue: 'planning',
        allowNull: false,
    },
},
{
    sequelize,
    modelName: 'trip',
    tableName: 'trip',
    timestamps: false, 
})

module.exports = Trip;