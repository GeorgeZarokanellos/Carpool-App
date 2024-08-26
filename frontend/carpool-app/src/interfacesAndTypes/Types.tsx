import { ProfilePictureBuffer } from "./Interfaces";

enum Role {
    DRIVER = "Driver",
    PASSENGER = "Passenger",
}

// enum Status {
//     PLANNING = "planning",
//     IN_PROGRESS = "in_progress",
//     COMPLETED = "completed",
// }


export type User = {
    firstName: string;
    lastName: string;
    role: Role;
    overallRating: number;
    noOfReviews: number;
}

export type Trip = {
    tripId: number;
    tripCreatorId: number;
    driverId: number | null;
    startLocationId: number;
    endLocationId: number;
    startingTime: string;
    noOfPassengers: number;
    noOfStops: number;
    status: string;
    driver: {
        licenseId?: number;
        user: {
            firstName: string;
            lastName: string;
            overallRating: string;
            profilePicture?: ProfilePictureBuffer;
        };
        vehicle: {
            noOfSeats: number;
            maker: string;
            model: string;
        }
    } | null;
    tripCreator: {
        firstName: string;
        lastName: string;
    }
    startLocation: {
        stopLocation: string;  
    }
    endLocation: {
        stopLocation: string;
    }
}

export type ExtendedTrip = Trip & {
    tripPassengers: tripPassenger[];
    tripStops: TripStops
}

export type tripPassenger = {
    passengerId: number;
    //TODO change passenger to details
    passenger: {
        firstName: string;
        lastName: string;
        overallRating: string;
        profilePicture?: ProfilePictureBuffer;
    }
}

export type TripStops = {
    stopId: number;
    details: {
        stopLocation: string;
        lat: number;
        lng: number;
    }
}[];


export type TextFieldTypes = 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'time';

export type Review = {
    reviewId: number;
    reviewRating: number;
    reviewDateTime: Date;
    tripId: number;
    reviewedUserId: number;
    // reviewerId: number;
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
    overallRating: number;
    profilePicture: ProfilePictureBuffer;
    userReviews: Review[];
    userSubmittedReviews: Review[];
    tripsCreated: Trip[];
    tripsParticipated: Trip[];
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
}