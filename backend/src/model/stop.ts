import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connect_to_db'; 

class Stop extends Model {
    declare stopId: number;
    declare stopLoc: string;
    declare lat: number;
    declare lng: number;
    declare side: number;
}

Stop.init({
    stopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'stop_id'
    },
    stopLocation: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'loc'
    },
    lat: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: 'lat'
    },
    lng: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: 'lng'
    },
    side: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'side'
    }
}, {
    sequelize,
    modelName: 'stops',
    tableName: 'stops',
    timestamps: false,
});

export default Stop;