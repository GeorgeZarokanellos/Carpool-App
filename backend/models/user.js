const {DataTypes, Model} = require ('sequelize');
const sequelize = require('../database/connect_to_db');

class User extends Model {}

User.init({ 
    //fields
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'user_id'
    },
    universityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'university_id'
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
    },
    lastName: {
        type: DataTypes.STRING,
        field: 'last_name'
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
    overallPoints: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'overall_points'
    },
}, 
{
    sequelize, // We need to pass the connection instance
    modelName: 'user', // We need to choose the model name
    tableName: 'app_user', // We need to choose the table name   
    timestamps: false,
});


module.exports = User;