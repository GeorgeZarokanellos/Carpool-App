import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connect_to_db'; 

class Stop extends Model {
    declare stopId: number;
    declare stopLoc: string;
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
        values: ['Plateia Gewrgiou', 'Plateia Olgas', 'Pyrosvesteio', 'Aretha'],
        allowNull: false,
        field: 'stop_loc'
    }
}, {
    sequelize,
    modelName: 'stops',
    tableName: 'stops',
    timestamps: false,
});

export default Stop;