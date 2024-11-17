import React, { useEffect, useState } from "react";
import { IonAlert, IonButton, IonLoading, IonModal, IonText } from "@ionic/react";
import "./TripInProgress.scss";
import instance from "../../AxiosConfig";
import { ExtendedTrip } from "../../interfacesAndTypes/Types";
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface TripInProgressProps {
    refreshKey: number | undefined;
    tripData: ExtendedTrip;
    tripDriverCurrentUser: boolean;
    userRole: string | null;
    userId: string | null;
    setDriverWantsToCompleteTrip: (value: boolean) => void;
    setDriverWantsToAbortTrip: (value: boolean) => void;
    checkForNextScheduledTrip: (userId: string | number, points? : number) => Promise<void>;  
}

interface removePassengerUpdateTripRequestBody {
    removePassengers: number[];
    removeStops?: number[];
    status?: string
}

export const TripInProgress: React.FC<TripInProgressProps> = ({
    refreshKey,
    tripData,
    tripDriverCurrentUser,
    userRole,
    userId,
    setDriverWantsToCompleteTrip, 
    setDriverWantsToAbortTrip,
    checkForNextScheduledTrip
}) => {
    const [tripCancelledAlert, setTripCancelledAlert] = useState(false);
    const [currentTripStatus, setCurrentTripStatus] = useState<string>(tripData.status);
    const [tripStatusUpdated, setTripStatusUpdated] = useState<boolean>(false);
    const [timeToDelay, setTimeToDelay] = useState<number>(5);
    const [openSelectTimeModal, setOpenSelectTimeModal] = useState<boolean>(false);
    const [notificationsAlertMessage, setNotificationsAlertMessage] = useState<string>('');
    const [openNotificationsAlert, setOpenNotificationsAlert] = useState<boolean>(false);
    const [passengerWantsToLeaveTrip , setPassengerWantsToLeaveTrip] = useState<boolean>(false);
    const [leaveTripOperationLoading, setLeaveTripOperationLoading] = useState<boolean>(false);
    const [issueReload, setIssueReload] = useState<boolean>(false);

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
            if(currentTripStatus === "cancelled" ){
                const promises: Promise<any>[] = [];
                setTripCancelledAlert(true);
                //update current trip id of the driver according to next scheduled trip
                await checkForNextScheduledTrip(tripData.driverId);
                //update trip id of passengers to null if trip is cancelled
                tripData.tripPassengers.forEach((passenger) => {
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
            await instance.get(`/trips/info/${tripData.tripId}`)
            .then((response) => {
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
            if(tripData.tripPassengers.length > 0){
                tripData.tripPassengers.forEach((tripPassenger) => (
                    promises.push(
                        instance.post('/notifications' , {
                            driverId: tripData.driverId,
                            passengerId: tripPassenger.passengerId,
                            tripId: tripData.tripId,
                            stopId: null,
                            message: delayMessage,
                            recipient: 'passenger',
                            type: 'delay'
                        })
                    )
                ));
                setNotificationsAlertMessage(`Trip's starting time has been pushed back by ${timeToDelay} minutes and delay notifications have been sent to the passengers!`);
            } else {
                setNotificationsAlertMessage(`Trip's starting time has been pushed back by ${timeToDelay} minutes!`);
            }
            promises.push(
                instance.patch(`/trips/${tripData.tripId}`, {
                    startingTime: new Date(new Date(tripData.startingTime).getTime() + timeToDelay * 60000).toISOString()
                })
            );
            await Promise.all(promises);
            setOpenNotificationsAlert(true);

        } catch (error) {
            setNotificationsAlertMessage('Error sending delay notifications. Please try again!');
            setOpenNotificationsAlert(true);
            console.log("Error sending the delay notifications", error);
        }
    }

    const removePassengerFromTrip = async () => {
        try {
            setLeaveTripOperationLoading(true);
            const promises: Promise<any>[] = [];
            const response = await instance.get(`/user/notification/${userId}?tripId=${tripData.tripId}`);
            const responseNotification = response.data.notification; 
            const deleteStop: boolean = response.data.deleteStop;
            const requestBody: removePassengerUpdateTripRequestBody = {
                removePassengers: [Number(userId)]
            }
            if(deleteStop && responseNotification.stopId !== tripData.startLocationId && responseNotification.stopId !== tripData.endLocationId){
                requestBody.removeStops = [responseNotification.stopId];
            } 
            if(tripData.noOfPassengers < tripData.driver.vehicle.noOfSeats && tripData.status === 'locked')
                requestBody.status = 'planning';
            
            promises.push(
                instance.patch(`/trips/${tripData.tripId}`, {
                    ...requestBody
                })
            );

            promises.push(
                instance.patch(`/user/${userId}`, {
                    currentTripId: null
                })
            );

            await Promise.all(promises);

            await instance.delete(`/user/${userId}?tripId=${tripData.tripId}`);
            setLeaveTripOperationLoading(false);
            setIssueReload(true);

        } catch (error) {
            console.log("Error removing user from trip");
            
        }
    }

    useEffect(()=>{
        if(tripStatusUpdated === true){
            checkTripStatusAndUpdateCurrentTripId();
            setTripStatusUpdated(false);
        }
    },[tripStatusUpdated]);

    useEffect(() => {
        if(refreshKey !== undefined){
            retrieveTripStatus();
        }
    }, [refreshKey]);

    useEffect(() => {
        if(issueReload === true){
            window.location.reload();
        }
    }, [issueReload]);

    return (
        <>
            {tripData.status === "in_progress" ? (
                <div className="trip-in-progress">
                    <IonText className="message">
                        Trip is in progress!
                    </IonText>
                    {
                        tripDriverCurrentUser &&
                        <IonButton shape="round" className="complete-trip-button" onClick={() => {
                            setDriverWantsToCompleteTrip(true)
                            }}>
                            Complete Trip
                        </IonButton>
                    }
                </div>
            ) : (
                <div className="trip-planning">
                    {
                        tripDriverCurrentUser && 
                            <div className="send-delay-notification">
                                <IonText className="message">Gonna be late? Let the others know!</IonText>
                                <IonButton shape="round" className="send-delay-notification-button" onClick={() => setOpenSelectTimeModal(true)}>
                                    Delay Trip
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
                        {
                            userRole === "passenger" && 
                            <IonButton shape="round" className="leave-trip-button" onClick={() => setPassengerWantsToLeaveTrip(true)}>
                                Leave Trip
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
            <IonAlert 
                isOpen={passengerWantsToLeaveTrip}
                header="Leave Trip"
                message="Are you sure you want to leave this trip?"
                buttons={[
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: () => setPassengerWantsToLeaveTrip(false)
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            removePassengerFromTrip();
                            setPassengerWantsToLeaveTrip(false);
                        }
                    }
                ]}
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
                        Done
                    </IonButton>
                </div>
                <IonAlert 
                    isOpen={openNotificationsAlert}
                    message={notificationsAlertMessage}
                    onDidDismiss={() => {
                        setOpenNotificationsAlert(false);
                        setOpenSelectTimeModal(false);
                        setIssueReload(true);
                    }}
                    buttons={['OK']}
                />
            </IonModal>
            <IonLoading 
                isOpen={leaveTripOperationLoading}
                message={'Leaving trip please wait...'}
            />
        </>
    );
}