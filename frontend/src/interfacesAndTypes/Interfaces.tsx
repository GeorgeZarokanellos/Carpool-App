import { TextFieldTypes } from './Types';

enum Status {
    Pending = 'Pending',
    Accepted = 'Accepted',
    Rejected = 'Rejected',
}

enum NotificationType {
    Request = 'request',
    Review = 'review',
    Delay = 'delay',
    Cancel = 'cancel',
}

export interface TripProps {
    startingTime: string;
    dateOfTrip: string;
    startLocation: string;
    endLocation: string;
    noOfPassengers: number;
    noOfStops: number;
    driver?: {
        user: {
            firstName: string,
            lastName: string,
            overallRating: string,
            profilePicture?: ProfilePictureBuffer
        };
        vehicle: {
            noOfSeats: number;
            maker: string;
            model: string;
        }
    };
    tripCreator:{
        firstName: string,
        lastName: string
    };
}

export interface LabelInputProps {
    label: string | undefined;
    placeholder?: string;
    name: string;
    type: TextFieldTypes;
    onIonChange: (e: CustomEvent) => void;
}

export interface ProfilePictureBuffer {
    type: 'Buffer';
    data: number[];
}

export interface NotificationInterface {
        notificationId: number;
        driverId: number;
        passengerId: number;
        tripId: number;
        message: string;
        stopId: number;
        timeSent: string;
        status: Status;
        recipient: string;
        type: NotificationType;
}