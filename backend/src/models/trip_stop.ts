import {DataTypes, Model} from 'sequelize';
import sequelize from '../database/connect_to_db'; // import the connection instance


class TripStop extends Model {
    declare tripId: number;
    declare stopId: number;
}

TripStop.init({
    // fields
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
    modelName: 'trip_stop',    // name of the model in the code
    tableName: 'trip_stop',    // name of the table in the db
    timestamps: false,
});

export default TripStop;