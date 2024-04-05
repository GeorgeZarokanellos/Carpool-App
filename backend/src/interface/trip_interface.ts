interface passengerInterface {
    firstName: string;
    lastName: string;
}

interface updateDetailsInterface {
    removePassengers?: passengerInterface[];
    addStops?: string[];
    removeStops?: string[];
}

enum role {
    driver = 'driver',
    passenger = 'passenger'
}

interface addUserRequestBodyInterface {
    universityId: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    role: role;
    phone: string;
}

interface carRegisterRequestBodyInterface {
    vehicleId: string;
    carMaker: string;
    carModel: string;
    carCapacity: number;
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
    reviewRequestBodyInterface
}

export { role };