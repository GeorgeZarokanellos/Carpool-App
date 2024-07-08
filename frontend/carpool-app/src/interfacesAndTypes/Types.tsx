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
    profilePicture: Blob;
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