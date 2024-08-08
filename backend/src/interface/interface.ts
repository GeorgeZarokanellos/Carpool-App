interface passengerInterface {
    firstName: string;
    lastName: string;
}

interface tripInterface {
    tripCreatorId: number;
    driverId: number | null;
    startLocation: string;
    startingTime: Date;
}

interface updateDetailsInterface {
    addPassengers?: passengerInterface[];
    removePassengers?: passengerInterface[];
    addStops?: number[];
    removeStops?: number[];
    updateStartingTime?: Date;
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
    plateNumber: string;
    maker: string;
    model: string;
    noOfSeats: number;
}

interface reviewRequestBodyInterface {
    reviewRating: number;
    reviewDateTime: Date;
}

interface updatedNotificationInterface {
    driverId: number;
    passengerId: number;
    tripId: number;
    status: string;
}

interface notificationInterface extends updatedNotificationInterface {
    message: string;
    stopId: number;
    recipient: string;
}

export type {
    passengerInterface,
    updateDetailsInterface,
    addUserRequestBodyInterface,
    carRegisterRequestBodyInterface,
    reviewRequestBodyInterface,
    tripInterface,
    notificationInterface,
    updatedNotificationInterface
}

export { role };