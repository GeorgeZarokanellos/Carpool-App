import { ProfilePictureBuffer } from "./Interfaces";

export enum Role {
    DRIVER = "driver",
    PASSENGER = "passenger",
    ALL_ROLES = "all_roles"
}

export enum tripStatus {
    INPROGRESS = 'in_progress',
    COMPLETED = 'completed',
    PLANNING = 'planning',
    LOCKED = 'locked',
    CANCELLED = 'cancelled'
}



export type User = {
    firstName: string;
    lastName: string;
    role: Role;
    overallRating: number;
    noOfReviews: number;
}

export type Driver = 
    {
        licenseId?: number;
        user: {
            firstName: string;
            lastName: string;
            overallRating: string;
            profilePicture?: ProfilePictureBuffer;
            noOfTripsCompleted: number;
        };
        vehicle: {
            noOfSeats: number;
            maker: string;
            model: string;
        }
    } 

export type Trip = {
    tripId: number;
    tripCreatorId: number;
    driverId: number;
    startLocationId: number;
    endLocationId: number;
    startingTime: string;
    noOfPassengers: number;
    noOfStops: number;
    status: string;
    driver: Driver;
    tripCreator: {
        firstName: string;
        lastName: string;
    }
    startLocation: {
        stopLocation: string;  
        side: number;
    }
    endLocation: {
        stopLocation: string;
        side: number;
    }
}

export type ExtendedTrip = Trip & {
    tripPassengers: tripPassenger[];
    tripStops: TripStops
    startLocation: Stop;
    endLocation: Stop;
}

export type tripPassenger = {
    passengerId: number;
    passenger: {
        firstName: string;
        lastName: string;
        overallRating: string;
        profilePicture?: ProfilePictureBuffer;
        noOfTripsCompleted: number;
    }
}

export type TripStops = {
    stopId: number;
    details: {
        stopLocation: string;
        lat: number;
        lng: number;
        side: number;
    }
}[];


export type TextFieldTypes = 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'time';

export type Review = {
    reviewId: number;
    reviewRating: string;
    reviewDateTime: string;
    tripId: number;
    reviewedUserId: number;
    reviewedUser: {
        firstName: string;
        lastName: string;
    }
    reviewerId: number;
    reviewer: {
        firstName: string;
        lastName: string;
    }
}

export type ProfileData = {
    username: string;
    firstName: string;
    lastName: string;
    role: Role;
    phone: string;
    overallRating: string;
    profilePicture: ProfilePictureBuffer;
    userReviews: Review[];
    userSubmittedReviews: Review[];
    tripsCompleted: Trip[];
}

export type descIndex = {
    text: string,
    index: number
}

export type autoMaker = {
    maker: string,
    models: string[]
}

export type Stop = {
    stopId: number;
    stopLocation: string;
    lat: number;
    lng: number;
    side: number;
}