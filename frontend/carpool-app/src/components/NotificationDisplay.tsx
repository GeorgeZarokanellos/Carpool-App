import React, { useEffect } from "react";
import { NotificationInterface } from "../interfacesAndTypes/Interfaces";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText } from "@ionic/react";
import instance from "../AxiosConfig";
import { ExtendedTrip, Trip } from "../interfacesAndTypes/Types";
import { TripInformation } from "./TripInformation";
import { formatDateTime } from "../util/common_functions";


interface NotificationProps {
    notificationDetails: NotificationInterface;
}

export const NotificationDisplay: React.FC<NotificationProps> = ({notificationDetails}) => {

    const [trip, setTrip] = React.useState<ExtendedTrip>();
    const [formattedTime, setFormattedTime] = React.useState<string>('');
    const [formattedDate, setFormattedDate] = React.useState<string>('');
    const userId = localStorage.getItem('userId');

    const handleReject = async () => {
        try {
            const passengerMessage = 'Η αίτηση σας για συμμετοχή στη διαδρομή του ' + 
                                        trip?.driver?.user.firstName + trip?.driver?.user.lastName +
                                        ' στις ' + formattedDate + ' απορρίφθηκε';
            console.log(passengerMessage);
            //TODO update notification to rejected
            instance.put(`/notifications/${notificationDetails.notificationId}`, {
                status: 'rejected'
            });
            
            //TODO create notification for the user that requested to join the trip
            instance.post(`/notifications`, {
                driverId: notificationDetails.driverId,
                passengerId: notificationDetails.passengerId,
                tripId: notificationDetails.tripId,    
                message: passengerMessage,
                stopId: notificationDetails.stopId,
                status: 'declined'
            });
            
        } catch (error) {
            console.log("Error rejecting notification", error);
        }
    }

    const handleAccept = async () => {
        try {
            if(Number(userId) === notificationDetails.driverId && trip) {
                const passengerMessage = 'Η αίτηση σας για συμμετοχή στη διαδρομή του ' + 
                                            trip?.driver?.user.firstName + trip?.driver?.user.lastName +
                                            ' στις ' + formattedDate + ' αποδοχθηκε';
                console.log(passengerMessage);
                //TODO update notification to accepted
                instance.put(`/notifications/${notificationDetails.notificationId}`, {
                    status: 'accepted'
                });
                
                //TODO create notification for the user that requested to join the trip
                instance.post(`/notifications`, {
                    driverId: notificationDetails.driverId,
                    passengerId: notificationDetails.passengerId,
                    tripId: notificationDetails.tripId,    
                    message: passengerMessage,
                    stopId: notificationDetails.stopId,
                    status: 'accepted'
                });

                const passengerName = await instance.get(`/user/${notificationDetails.passengerId}`);

                await instance.put(`/trips/${notificationDetails.tripId}`, {
                    userId: notificationDetails.driverId,
                    addPassengers: [{
                        firstName: passengerName.data.firstName,
                        lastName: passengerName.data.lastName
                    }],
                    addStops: [
                        notificationDetails.stopId
                    ]
                });
            }
            
        } catch (error) {
            console.log("Error accepting notification", error);
        }
    }

    useEffect(() => {
        const retrieveTripInfo = async () => {
            try {
                const tripMentioned = await instance.get(`/trips/${notificationDetails.tripId}`);
                console.log(tripMentioned);
                setTrip(tripMentioned.data);

                const {formattedDate, formattedTime}  = formatDateTime(tripMentioned.data.startingTime);
                setFormattedDate(formattedDate);
                setFormattedTime(formattedTime);
            } catch (error) {
                console.log("Error retrieving trip info", error);
            }
        }
        retrieveTripInfo();
    }, []);

    return (
        <IonCard style={{borderRadius: '1rem', color: 'black'}} color="primary">
            <IonCardHeader>
                <IonCardTitle class="ion-text-center">Αίτηση για συμμετοχή σε διαδρομή σας</IonCardTitle>
            </IonCardHeader>
            <IonCardContent style={{padding: '0rem'}}>
                <div className="notification-message" style={{display: 'flex', textAlign: 'center'}}>
                    {notificationDetails.message}
                </div>
                <div style={{width: '100%'}}>
                    {
                        
                        trip ? (
                            <TripInformation 
                                startingTime={formattedTime} 
                                dateOfTrip={formattedDate} 
                                origin={trip.startLocation}
                                noOfPassengers={trip.noOfPassengers}
                                noOfStops={trip.noOfStops}
                                finish='Πρητανεία'
                                driver={{
                                        user: trip.driver? trip.driver.user : {
                                            firstName: 'No driver yet',
                                            lastName: '',
                                            overallRating: '0'
                                        }
                                    }
                                }
                                tripCreator ={trip.tripCreator}
                            />
                        ) : ''
                    }
                </div>
            </IonCardContent>
            <div style={{display: 'flex', alignItems: 'center' , justifyContent: 'center', }}>
                <IonButton color="danger">Απορριψη</IonButton>
                <IonButton color="success">Αποδοχη</IonButton>
            </div>
        </IonCard>
    );
}