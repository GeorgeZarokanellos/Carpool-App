import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connect_to_db';


class Notification extends Model {}

Notification.init({
    // fields
    notificationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'notification_id'
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'message'
    },
    timeSent: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'time_sent'
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'status'
    },
},
{
    sequelize,
    modelName: 'notification',
    tableName: 'notification',
    timestamps: false,
})

export default Notification;