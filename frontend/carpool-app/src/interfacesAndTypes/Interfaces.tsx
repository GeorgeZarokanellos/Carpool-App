import { TextFieldTypes } from '../interfacesAndTypes/Types';

export interface TripProps {
    startingTime: string;
    dateOfTrip: string;
    origin: string;
    noOfPassengers: number;
    noOfStops: number;
    finish: string;
    driver: {
        user: {
            firstName: string,
            lastName: string,
            overallRating: string,
            profilePicture?: ProfilePictureBuffer
        };
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