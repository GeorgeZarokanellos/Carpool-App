import {DataTypes, Model} from 'sequelize';
import sequelize from '../database/connect_to_db'; //import the connection instance


class TripStops extends Model {
    declare tripId: number;
    declare stopId: number;
}

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

export default TripStops;