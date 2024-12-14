enum role {
    DRIVER = 'driver',
    PASSENGER = 'passenger',
    ALL_ROLES = 'all_roles'
}

enum NotificationType {
    REQUEST = 'request',
    REVIEW = 'review'
}

export enum CouponStatus {
    ACTIVE = 'active',
    REDEEMED = 'redeemed',
}

export enum tripStatus {
    INPROGRESS = 'in_progress',
    COMPLETED = 'completed',
    PLANNING = 'planning',
    LOCKED = 'locked',
    CANCELLED = 'cancelled'
}

interface tripInterface {
    tripCreatorId: number;
    driverId: number | null;
    startLocationId: number;
    endLocationId: number;
    startingTime: Date;
    noOfPassengers: number;
}

interface updatedTripInterface {
    addPassengers?: number[];
    removePassengers?: number[];
    addStops?: number[];
    removeStops?: number[];
    updateStartingTime?: Date;
    status?: tripStatus;
}

interface updatedUserInterface {
    currentTripId?: number;
    overallPoints?: number;
    pendingRequestTripId?: number;
    tripCompleted?: boolean;
    noOfTripsCompleted?: number; 
}


interface addUserRequestBodyInterface {
    universityId: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email?: string;
    role: role;
    phone?: string;
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