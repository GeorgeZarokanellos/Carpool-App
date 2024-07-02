import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connect_to_db';

class Driver extends Model {}

Driver.init({
    // fields
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'driver_id'
    },
    licenseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'license_id'
    }
    //TODO add license id field
}, 
{
    sequelize,
    modelName: 'driver',
    tableName: 'driver',
    timestamps: false,
});

export default Driver;