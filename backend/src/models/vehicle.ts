import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connect_to_db';

class Vehicle extends Model {}

Vehicle.init({
    // fields
    plateNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'plate_number'
    },
    ownerId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'owner_id'
    },
    maker: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'maker'
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'model'
    },
    noOfSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'no_of_seats'
    },
},
{
    sequelize,
    modelName: 'vehicle',
    tableName: 'vehicle',
    timestamps: false,
})

export default Vehicle;