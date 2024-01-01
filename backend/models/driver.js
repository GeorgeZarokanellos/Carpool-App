const {DataTypes, Model} = require ('sequelize');
const sequelize = require('../database/connect_to_db');

class Driver extends Model {}

Driver.init({
    //fields
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'driver_id'
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'vehicle_id'
    },
    licenseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'license_id'
    }
}, 
{
    sequelize,
    modelName: 'driver',
    tableName: 'driver',
    timestamps: false,
});

module.exports = Driver;