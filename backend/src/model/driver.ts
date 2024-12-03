import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connect_to_db';

class Driver extends Model {
}

Driver.init({
    // fields
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'driver_id'
    },
    licenseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'license_id'
    },
    nextScheduledTripId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'next_scheduled_trip_id',
        defaultValue: null
    },
}, 
{
    sequelize,
    modelName: 'driver',
    tableName: 'driver',
    timestamps: false,
});

export default Driver;