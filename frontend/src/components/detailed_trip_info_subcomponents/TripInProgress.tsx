import React, { useEffect, useState } from "react";
import { IonAlert, IonButton, IonText } from "@ionic/react";
import "./TripInProgress.scss";
import instance from "../../AxiosConfig";

interface TripInProgressProps {
    startingTime: string;    // const itemColor = "rgb(44, 110, 219)";
    tripDriverCurrentUser: boolean;
    driverId: number | null;
    tripStatus: string;
    setDriverWantsToEndTrip: (value: boolean) => void;
    setDriverWantsToAbortTrip: (value: boolean) => void;    
}

export const TripInProgress: React.FC<TripInProgressProps> = ({
    startingTime, 
    tripDriverCurrentUser,
    driverId, 
    tripStatus,
    setDriverWantsToEndTrip, 
    setDriverWantsToAbortTrip
}) => {
    // const [tripInProgress, setTripInProgress] = useState(false);
    const [tripCancelledAlert, setTripCancelledAlert] = useState(false);
    
    const checkTripTimeAndNoOfPassengers = async () => {
        if(tripStatus === "cancelled"){
            //update drivers current trip id to null
            await instance.put(`/user/${driverId}`,{
                currentTripId: null
            })
            .then(() => {
                console.log("Driver's current trip id set to null");
                setTripCancelledAlert(true);
            })
            .catch((error) => {
                console.log("Error when updating drivers current trip id: ",error);
            });
        }
    }
    
    
    useEffect(() => {
        checkTripTimeAndNoOfPassengers();
    }, [startingTime]);
    return (
        <>
            {tripStatus === "in_progress" ? (
                <div className="trip-in-progress">
                    <IonText className="message">
                        Trip is in progress!
                    </IonText>
                    {
                        tripDriverCurrentUser &&
                        <IonButton shape="round" className="end-trip-button" onClick={() => setDriverWantsToEndTrip(true)}>
                            End Trip
                        </IonButton>
                    }
                </div>
            ) : (
                <div className="trip-not-in-progress">
                    <IonText className="message">
                        This trip hasn&apos;t started yet
                    </IonText>
                    {
                        tripDriverCurrentUser &&
                        <IonButton shape="round" className="abort-trip-button" onClick={() => setDriverWantsToAbortTrip(true)}>
                            Cancel Trip
                        </IonButton>
                    }
                </div>
            )}
            <IonAlert 
                isOpen={tripCancelledAlert}
                onDidDismiss={() => {
                    setTripCancelledAlert(false)
                    window.location.reload();
                }}
                header="Trip Cancelled"
                message="Your trip has been cancelled because no passengers have joined the trip"
                buttons={["OK"]}
            />
        </>
    );
}