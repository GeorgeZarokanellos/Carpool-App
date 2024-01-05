const {DataTypes, Model} = require ('sequelize');
const sequelize = require('../database/connect_to_db');

class Stops extends Model {}

Stops.init({
    stop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    stop_loc: {
        type: DataTypes.ENUM,
        values: ['Plateia Gewrgiou', 'Plateia Olgas', 'Pyrosvesteio', 'Aretha'],
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'stops',
    tableName: 'stops',
    timestamps: false,
});

module.exports = Stops;