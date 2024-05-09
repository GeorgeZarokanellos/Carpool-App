enum Role {
    DRIVER = "Driver",
    PASSENGER = "Passenger",
}

export type User = {
    firstName: string;
    lastName: string;
    role: Role;
    overallRating: number;
    noOfReviews: number;
}