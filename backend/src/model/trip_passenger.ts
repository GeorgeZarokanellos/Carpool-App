import {DataTypes, Model} from 'sequelize';
import sequelize from '../database/connect_to_db';

class TripPassenger extends Model {
    declare tripId: number; 
    declare passengerId: number;
}

TripPassenger.init({
    // fields
    tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'trip_id'
    },
    passengerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'passenger_id'
    },

}, {
    sequelize,
    modelName: 'tripPassenger',    // name of the model in the code
    tableName: 'trip_passengers',    // name of the table in the db
    timestamps: false,
});

export default TripPassenger;