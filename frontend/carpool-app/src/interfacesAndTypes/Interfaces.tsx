


export interface TripProps {
    startingTime: string;
    dateOfTrip: string;
    origin: string;
    noOfPassengers: number;
    noOfStops: number;
    finish: string;
    driver: {
        user: {
            firstName: string,
            lastName: string
        }
    };
    tripCreator:{
        firstName: string,
        lastName: string
    };
}

