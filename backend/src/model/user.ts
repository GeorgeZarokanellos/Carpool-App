import { DataTypes, Model} from 'sequelize';
import sequelize from '../database/connect_to_db';
import { role } from '../interface/trip_interface';

// user id is not provided when creating a new user since the database will automatically generate it
// interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> {}  

class User extends Model {
    declare userId: number;
    declare universityId: number;
    declare firstName: string;
    declare lastName: string;
    declare username: string;
    declare password: string;
    declare email: string;
    declare role: role;
    declare phone: string;
    declare overallRating: number;
    declare overallPoints: number;
    declare noOfReviews: number;
    declare profilePicture: Blob;
}

User.init({ 
    // fields
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
        field: 'username'
    },
    password: {
        type: DataTypes.STRING,
        field: 'password'
    },
    email: {
        type: DataTypes.STRING,
        field: 'email'
    },
    role: {
        type: DataTypes.ENUM(role.driver, role.passenger),
        allowNull: false,
        field: 'role'
    },
    phone: {
        type: DataTypes.STRING,
        field: 'phone'
    },
    overallRating: {
        type: DataTypes.DECIMAL(3,2),
        defaultValue: 0,
        field: 'overall_rating'
    },
    overallPoints: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'overall_points'
    },
    noOfReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'no_of_reviews'
    },
    profilePicture: {
        type: DataTypes.BLOB,
        field: 'profile_picture'
    }

}, 
{
    sequelize, // We need to pass the connection instance
    modelName: 'user', // We need to choose the model name
    tableName: 'app_user', // We need to choose the table name   
    timestamps: false,
});

export default User;