import React, { useEffect, useState } from "react";
import { IonAlert, IonButton, IonModal, IonText } from "@ionic/react";
import "./TripInProgress.scss";
import instance from "../../AxiosConfig";
import { tripPassenger } from "../../interfacesAndTypes/Types";
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    const [timeToDelay, setTimeToDelay] = useState<number>(5);
    const [openSelectTimeModal, setOpenSelectTimeModal] = useState<boolean>(false);
    const [notificationsAlertMessage, setNotificationsAlertMessage] = useState<string>('');
    const [openNotificationsAlert, setOpenNotificationsAlert] = useState<boolean>(false);

    const incrementValue = () => {
        if(timeToDelay + 5 <= 30)
            setTimeToDelay(timeToDelay + 5);
    }

    const decrementValue = () => {
        if(timeToDelay -5 > 0)
            setTimeToDelay(timeToDelay - 5);
    }

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
                //update trip id of passengers to null if trip is cancelled
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
            await instance.get(`/trips/info/${tripId}`)
            .then((response) => {
                console.log("Retrieving trip status", response.data.status);
                setCurrentTripStatus(response.data.status);
                setTripStatusUpdated(true);
            });
        } catch (error) {
            console.log("Error retrieving trip status: ", error);
        }
    }

    const sendNotificationsToUsers = async () => {
        try {
            const delayMessage = `The trip has been delayed by ${timeToDelay} minutes by the driver!`
            const promises: Promise<any>[] = [];
            tripPassengers.forEach((tripPassenger) => (
                promises.push(
                    instance.post('/notifications' , {
                        driverId,
                        passengerId: tripPassenger.passengerId,
                        tripId,
                        stopId: null,
                        message: delayMessage,
                        recipient: 'passenger',
                        type: 'info'
                    })
                )
            ));
            setNotificationsAlertMessage('Delay notifications have been sent to the passengers');
            await Promise.all(promises);
            setOpenNotificationsAlert(true);

        } catch (error) {
            setNotificationsAlertMessage('Error sending delay notifications. Please try again!');
            setOpenNotificationsAlert(true);
            console.log("Error sending the delay notifications", error);
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
                <div className="trip-planning">
                    {
                        tripDriverCurrentUser && tripPassengers.length > 0 && 
                            <div className="send-delay-notification">
                                <IonText className="message">Gonna be late? Let the others know!</IonText>
                                <IonButton shape="round" className="send-delay-notification-button" onClick={() => setOpenSelectTimeModal(true)}>
                                    Alert Users
                                </IonButton>
                            </div>
                    }
                    <div className="trip-not-in-progress">
                        <IonText className="message">
                            This trip hasn&apos;t started yet!
                        </IonText>
                        {
                            tripDriverCurrentUser &&
                            <IonButton shape="round" className="abort-trip-button" onClick={() => setDriverWantsToAbortTrip(true)}>
                                Cancel Trip
                            </IonButton>
                        }
                    </div>
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
            <IonModal isOpen={openSelectTimeModal}>
                <div className="close-modal">
                    <IonButton 
                        onClick={() => setOpenSelectTimeModal(false)}
                    >Go Back</IonButton>
                </div>
                <div className="modal-contents">
                    <h4 style={{textAlign: 'center'}}>Select how many minutes to delay the start of the trip</h4>
                    <InputGroup className="input-group">
                        <Button 
                            variant='outline-secondary' 
                            onClick={() => decrementValue()} 
                        >-</Button>
                        <FormControl 
                            type='string' 
                            value={`${timeToDelay} minutes`} 
                            readOnly 
                            className="form-control"
                        />
                        <Button 
                            variant='outline-secondary' 
                            onClick={() => incrementValue()}
                        >+</Button>
                    </InputGroup>
                    <IonButton onClick={() => sendNotificationsToUsers()}>
                        Send Notification To Users
                    </IonButton>
                </div>
                <IonAlert 
                    isOpen={openNotificationsAlert}
                    message={notificationsAlertMessage}
                    onDidDismiss={() => {
                        setOpenNotificationsAlert(false);
                        setOpenSelectTimeModal(false);
                    }}
                    buttons={['OK']}
                />
            </IonModal>
        </>
    );
}