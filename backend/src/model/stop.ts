import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connect_to_db'; 

class Stop extends Model {
    declare stopId: number;
    declare stopLoc: string;
}

const enum StopLocation {
    PLATEIA_GEWRGIOU = 'Πλατεία Γεωργίου',
    PLATEIA_OLGAS = 'Πλατεία Όλγας',
    PYROSVESTEIO = 'Πυροσβεστίο',
    ARETHA = 'Αρέθα'
}

Stop.init({
    stopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'stop_id'
    },
    stopLocation: {
        type: DataTypes.ENUM,
        values: [StopLocation.PLATEIA_GEWRGIOU, StopLocation.PLATEIA_OLGAS, StopLocation.PYROSVESTEIO, StopLocation.ARETHA],
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
    }
}, {
    sequelize,
    modelName: 'stops',
    tableName: 'stops',
    timestamps: false,
});

export default Stop;