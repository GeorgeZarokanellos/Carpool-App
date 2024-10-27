enum role {
    driver = 'driver',
    passenger = 'passenger'
}

enum NotificationType {
    REQUEST = 'request',
    REVIEW = 'review'
}

export enum tripStatus {
    INPROGRESS = 'in_progress',
    COMPLETED = 'completed',
    PLANNING = 'planning',
    LOCKED = 'locked',
    CANCELLED = 'cancelled'
}

interface passengerInterface {
    firstName: string;
    lastName: string;
}

interface tripInterface {
    tripCreatorId: number;
    driverId: number | null;
    startLocationId: number;
    endLocationId: number;
    startingTime: Date;
    status?: tripStatus;
}

interface updatedTripInterface {
    addPassengers?: passengerInterface[];
    removePassengers?: passengerInterface[];
    addStops?: number[];
    removeStops?: number[];
    updateStartingTime?: Date;
    status?: tripStatus;
}

interface updatedUserInterface {
    currentTripId?: number;
    overallPoints?: number;
    pendingRequestTripId?: number;
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
    licenseId: number;
    plateNumber: string;
    maker: string;
    model: string;
    noOfSeats: number;
}

interface reviewRequestBodyInterface {
    reviewRating: number;
    reviewerId: number;
    reviewedUserId: number;
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
    type: NotificationType;
}

export type {
    passengerInterface,
    updatedTripInterface ,
    addUserRequestBodyInterface,
    carRegisterRequestBodyInterface,
    reviewRequestBodyInterface,
    tripInterface,
    notificationInterface,
    updatedNotificationInterface,
    updatedUserInterface
}

export { role };