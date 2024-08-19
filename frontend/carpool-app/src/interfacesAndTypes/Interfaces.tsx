import { TextFieldTypes } from '../interfacesAndTypes/Types';

enum Status {
    Pending = 'Pending',
    Accepted = 'Accepted',
    Rejected = 'Rejected',
}

enum NotificationType {
    Request = 'request',
    Review = 'review',
}

export interface TripProps {
    startingTime: string;
    dateOfTrip: string;
    origin: string;
    noOfPassengers: number;
    noOfStops: number;
    finish: string;
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

export interface LabelInputProps<T extends string | number > {
    label: string | undefined;
    value: T;
    type: TextFieldTypes;
    onIonChange: React.Dispatch<React.SetStateAction<T>>;
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