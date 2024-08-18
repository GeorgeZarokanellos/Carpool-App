import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connect_to_db';

class Vehicle extends Model {
    declare plateNumber: string;
    declare ownerId: number;
    declare noOfSeats: number;
    declare model: string;
    declare maker: string;
}

Vehicle.init({
    // fields
    plateNumber: {
        type: DataTypes.STRING,
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
    noOfSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'no_of_seats'
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'model'
    },
    maker: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'maker'
    },
},
{
    sequelize,
    modelName: 'vehicle',
    tableName: 'vehicle',
    timestamps: false,
})

export default Vehicle;