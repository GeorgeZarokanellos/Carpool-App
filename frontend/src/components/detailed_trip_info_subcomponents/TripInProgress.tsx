import React, { useEffect, useState } from "react";
import { IonAlert, IonButton, IonText } from "@ionic/react";
import "./TripInProgress.scss";
import instance from "../../AxiosConfig";
import { tripPassenger } from "../../interfacesAndTypes/Types";

interface TripInProgressProps {
    refreshKey: number | undefined;
    tripId: number;
    tripDriverCurrentUser: boolean;
    driverId: number;
    tripStatus: string;
    tripPassengers: tripPassenger[];
    setDriverWantsToEndTrip: (value: boolean) => void;
    setDriverWantsToAbortTrip: (value: boolean) => void;
    checkForNextScheduledTrip: (userId: string | number, points? : number) => Promise<void>;  
}

export const TripInProgress: React.FC<TripInProgressProps> = ({
    refreshKey,
    tripId,
    tripDriverCurrentUser,
    driverId, 
    tripStatus,
    tripPassengers,
    setDriverWantsToEndTrip, 
    setDriverWantsToAbortTrip,
    checkForNextScheduledTrip
}) => {
    const [tripCancelledAlert, setTripCancelledAlert] = useState(false);
    const [currentTripStatus, setCurrentTripStatus] = useState<string>(tripStatus);
    const [tripStatusUpdated, setTripStatusUpdated] = useState<boolean>(false);

    const checkTripStatusAndUpdateCurrentTripId = async () => {
        try {
            console.log("Current trip status: ", currentTripStatus);
            console.log(currentTripStatus === "cancelled");
            
            if(currentTripStatus === "cancelled" ){
                console.log("Went into if cancelled");
                
                const promises: Promise<any>[] = [];
                setTripCancelledAlert(true);
                //update current trip id of the driver according to next scheduled trip
                await checkForNextScheduledTrip(driverId);
                tripPassengers.forEach((passenger) => {
                    promises.push(
                        instance.patch(`/user/${passenger.passengerId}`, {
                            currentTripId: null
                        })
                    );
                });

                await Promise.all(promises);
                console.log("Passengers' current trip id set to null");
            }
        } catch (error) {
            console.log("Error when trying to update current trip of driver and passengers due to cancelled trip: ", error);
        }
    }
    
    const retrieveTripStatus = async () => {
        try {
            await instance.get(`/trips/status/${tripId}`)
            .then((response) => {
                console.log("Retrieving trip status", response.data.status);
                setCurrentTripStatus(response.data.status);
                setTripStatusUpdated(true);
            });
        } catch (error) {
            console.log("Error retrieving trip status: ", error);
        }
    }
    
    useEffect(() => {
        if(refreshKey !== undefined){
            retrieveTripStatus();
        }
    }, [refreshKey]);

    useEffect(()=>{
        if(tripStatusUpdated === true){
            checkTripStatusAndUpdateCurrentTripId();
            setTripStatusUpdated(false);
        }
    },[tripStatusUpdated])
    return (
        <>
            {tripStatus === "in_progress" ? (
                <div className="trip-in-progress">
                    <IonText className="message">
                        Trip is in progress!
                    </IonText>
                    {
                        tripDriverCurrentUser &&
                        <IonButton shape="round" className="complete-trip-button" onClick={() => setDriverWantsToEndTrip(true)}>
                            Complete Trip
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