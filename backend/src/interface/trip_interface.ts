interface passengerInterface {
    firstName: string;
    lastName: string;
}

interface tripInterface {
    userId: number;
    driverId: number | null;
    startLocation: string;
    startingTime: Date;
}

interface updateDetailsInterface {
    removePassengers?: passengerInterface[];
    addStops?: string[];
    removeStops?: string[];
    updateStartingTime?: Date;
}

enum role {
    driver = 'driver',
    passenger = 'passenger'
}

interface addUserRequestBodyInterface {
    universityId: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    role: role;
    phone: string;
}

interface carRegisterRequestBodyInterface {
    plateNumber: string;
    maker: string;
    model: string;
    noOfSeats: number;
}

interface reviewRequestBodyInterface {
    reviewRating: number;
    reviewDateTime: Date;
}

export type {
    passengerInterface,
    updateDetailsInterface,
    addUserRequestBodyInterface,
    carRegisterRequestBodyInterface,
    reviewRequestBodyInterface,
    tripInterface
}

export { role };