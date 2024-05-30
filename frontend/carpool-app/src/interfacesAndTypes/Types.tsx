enum Role {
    DRIVER = "Driver",
    PASSENGER = "Passenger",
}

enum Status {
    PLANNING = "Planning",
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed",
}


export type User = {
    firstName: string;
    lastName: string;
    role: Role;
    overallRating: number;
    noOfReviews: number;
}

export type Trip = {
    tripId: number;
    driverId: number;
    startLocation: string;
    startingTime: string;
    noOfPassengers: number;
    noOfStops: number;
    status: Status;
    driver: {
        user: {
            firstName:string;
            lastName:string;
        }
    };
    tripCreator: {
        firstName: string;
        lastName: string;
    }
}

export type TextFieldTypes = 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'time';

type Review = {
    reviewId: number;
    reviewRating: number;
    reviewDateTime: Date;
    tripId: number;
    reviewedUserId: number;
    reviewerId: number;
}

export type ProfileData = {
    username: string;
    firstName: string;
    lastName: string;
    role: Role;
    phone: string;
    overallRating: string;
    userReviews: Review[];
    userSubmittedReviews: Review[];
    tripsCreated: Trip[];
    tripsParticipated: Trip[];
}