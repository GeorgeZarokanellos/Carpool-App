import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/connect_to_db';

enum Role {
    Driver = 'driver',
    Passenger = 'passenger',
}

interface UserAttributes{
    userId?: number;
    universityId: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    role: Role;
    phone: string;
    rating?: number;
    overallPoints?: number;
}

//user id is not provided when creating a new user since the database will automatically generate it
// interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> {}  

class User extends Model<UserAttributes> {
    declare userId: number;
    declare universityId: number;
    declare firstName: string;
    declare lastName: string;
    declare username: string;
    declare password: string;
    declare email: string;
    declare role: Role;
    declare phone: string;
    declare rating: number;
    declare overallPoints: number;
}

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
        type: DataTypes.ENUM(Role.Driver, Role.Passenger),
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

export default User;