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
