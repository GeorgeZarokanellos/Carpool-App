import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connect_to_db'; // import the connection instance

class Trip extends Model {
    declare tripId: number;
    declare tripCreatorId: number;
    declare driverId: number | null;
    declare startLocation: string;
    declare startingTime: Date;
    declare noOfPassengers: number;
    declare noOfStops: number;
    declare status: string;
}

Trip.init({
    // fields
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
        field: 'creator_id'
    },
    driverId: {
        type: DataTypes.INTEGER,
        field: 'driver_id'
    },
    startLocationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'start_loc_id'
    },
    endLocationId : {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'end_loc_id'
    },
    startingTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'starting_time'
    },
    noOfPassengers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'no_of_passengers'
    },
    noOfStops: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'no_of_stops'
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

export default Trip;