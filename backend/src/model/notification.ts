import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connect_to_db';

const enum Status {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined'
}

const enum NotificationType {
    REQUEST = 'request',
    REVIEW = 'review',
}

class Notification extends Model {
    declare notificationId: number;
    declare driverId: number;
    declare passengerId: number;
    declare tripId: number;
    declare stopId: number;
    declare message: string;
    declare timeSent: Date;
    declare status: Status;
    declare recipient: string;
    declare type: NotificationType;
}

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
        allowNull: true,
        field: 'passenger_id'
    },
    tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'trip_id'
    },
    stopId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    },
    type: {
        type: DataTypes.ENUM,
        values: [NotificationType.REQUEST, NotificationType.REVIEW],
        allowNull: false,
        field: 'type'
    }
},
{
    sequelize,
    modelName: 'notification',
    tableName: 'notifications',
    timestamps: false,
})

export default Notification;