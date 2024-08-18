import React, { useEffect, useState } from "react";
import { IonButton, IonText } from "@ionic/react";
import "./TripInProgress.scss";

interface TripInProgressProps {
    startingTime: string;
    tripDriverCurrentUser: boolean;
    setDriverWantsToEndTrip: (value: boolean) => void;
}

export const TripInProgress: React.FC<TripInProgressProps> = ({startingTime, tripDriverCurrentUser, setDriverWantsToEndTrip}) => {
    const [tripInProgress, setTripInProgress] = useState(false);
    useEffect(() => {
        const currentTime = new Date().getTime();                
        const tripStartTime = new Date(startingTime).getTime();
        
        //the check happens in UTC time
        if (tripStartTime <= currentTime) {
            setTripInProgress(true);
        }
    }, [startingTime]);
    return (
        tripInProgress ? (
            <div className="trip-in-progress">
                <IonText>
                    Το ταξίδι είναι σε εξέλιξη!
                    
                </IonText>
                {
                    tripDriverCurrentUser &&
                    <IonButton  color="danger" onClick={() => setDriverWantsToEndTrip(true)}>
                        Τερματισμος ταξιδιου
                    </IonButton>
                }
            </div>
        ) : (
            <div className="trip-not-in-progress">
                <IonText>
                    Το ταξίδι δεν έχει ξεκινήσει ακόμα
                </IonText>
            </div>
        )
    );
}