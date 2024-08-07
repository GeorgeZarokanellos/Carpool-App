import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connect_to_db';

const enum Status {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined'
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
    tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'trip_id'
    },
    stopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'stop_id'
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'message'
    },
    timeSent: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'time_sent'
    },
    status: {
        type: DataTypes.ENUM,
        values: [Status.PENDING, Status.ACCEPTED, Status.DECLINED],
        allowNull: true,
        field: 'status',
    },
    recipient: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'recipient'
    }
},
{
    sequelize,
    modelName: 'notification',
    tableName: 'notifications',
    timestamps: false,
})

export default Notification;