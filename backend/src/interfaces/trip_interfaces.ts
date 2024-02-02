interface passengerInterface {
    firstName: string;
    lastName: string;
}

interface stopLocInterface {
    stopLoc: string;
}

interface updateDetailsInterface {
    removePassengers?: passengerInterface[];
    addStops?: stopLocInterface[];
    removeStops?: stopLocInterface[];
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

export type {
    passengerInterface,
    stopLocInterface,
    updateDetailsInterface,
    addUserRequestBodyInterface,
    carRegisterRequestBodyInterface
}

export { role };