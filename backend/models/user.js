const {DataTypes, Model} = require ('sequelize');
const sequelize = require('../database/connect_to_db');

class User extends Model {}

User.init({ 
    //fields
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    university_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.ENUM,
        values: ['driver', 'passenger'],
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
    },
    rating: {
        type: DataTypes.DECIMAL(3,2),
        defaultValue: 0,
    },
    overall_points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, 
{
    sequelize, // We need to pass the connection instance
    modelName: 'user', // We need to choose the model name
    tableName: 'app_user', // We need to choose the table name   
    timestamps: false,
});


module.exports = User;