import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connect_to_db';

const enum Status {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}

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
    driverId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'driver_id'
    },
    passengerId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'passenger_id'
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'message'
    },
    stopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'stop_id'
    },
    timeSent: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'time_sent'
    },
    status: {
        type: DataTypes.ENUM,
        values: [Status.PENDING, Status.ACCEPTED, Status.REJECTED],
        allowNull: false,
        field: 'status',
    },
},
{
    sequelize,
    modelName: 'notification',
    tableName: 'notification',
    timestamps: false,
})

export default Notification;