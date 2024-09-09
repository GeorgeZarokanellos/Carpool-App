import React, { useEffect, useState } from "react";
import { IonItem } from "@ionic/react";
import "./TripInProgress.scss";
import instance from "../AxiosConfig";

interface TripInProgressProps {
    tripId: number;
    startingTime: string;    // const itemColor = "rgb(44, 110, 219)";

    tripDriverCurrentUser: boolean;
    setDriverWantsToEndTrip: (value: boolean) => void;
}

export const TripInProgress: React.FC<TripInProgressProps> = ({tripId, startingTime, tripDriverCurrentUser, setDriverWantsToEndTrip}) => {
    const [tripInProgress, setTripInProgress] = useState(false);
    useEffect(() => {
        const currentTime = new Date().getTime();                
        const tripStartTime = new Date(startingTime).getTime();
        
        //the check happens in UTC time
        if (tripStartTime <= currentTime && !tripInProgress) {
            setTripInProgress(true);
            //update trip status to in_progress
            instance.patch(`/trips/${tripId}`,
                {
                    status: "in_progress"
                }
            ).then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error);
            });
        }
    }, [startingTime]);
    return (
        tripInProgress ? (
            <div className="trip-in-progress">
                <IonItem shape="round">
                    The trip is in progress!
                </IonItem>
                {
                    tripDriverCurrentUser &&
                    <IonItem  color="danger" onClick={() => setDriverWantsToEndTrip(true)}>
                        End Trip
                    </IonItem>
                }
            </div>
        ) : (
            <div className="trip-not-in-progress">
                <IonItem shape="round">
                    This trip hasn&apos;t started yet
                </IonItem>
            </div>
        )
    );
}