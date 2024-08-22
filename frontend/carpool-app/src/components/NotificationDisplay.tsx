import React, { useEffect, useState } from "react";
import { NotificationInterface } from "../interfacesAndTypes/Interfaces";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText } from "@ionic/react";
import instance from "../AxiosConfig";
import { ExtendedTrip, Trip } from "../interfacesAndTypes/Types";
import { TripInformation } from "./TripInformation";
import { formatDateTime } from "../util/common_functions";
import Rating from "@mui/material/Rating";
import './NotificationDisplay.scss';
import { Swiper, SwiperSlide } from "swiper/react";

interface NotificationProps {
    notificationDetails: NotificationInterface;
}

export const NotificationDisplay: React.FC<NotificationProps> = ({notificationDetails}) => {

    const [trip, setTrip] = useState<ExtendedTrip>();
    const [formattedTime, setFormattedTime] = useState<string>('');
    const [formattedDate, setFormattedDate] = useState<string>('');
    const [accepted, setAccepted] = useState<boolean>(false);
    const [rejected, setRejected] = useState<boolean>(false);
    const [displayAcceptReject, setDisplayAcceptReject] = useState<boolean>(false);
    const [userRating, setUserRating] = useState<number>(0);
    const [tripParticipants, setTripParticipants] = useState<{firstName: string, lastName: string}[]>([]);
    const userId = localStorage.getItem('userId');

    const handleReject = async () => {
        try {
            const passengerMessage = 'Η αίτηση σας για συμμετοχή στη διαδρομή του/της ' + 
                                        trip?.driver?.user.firstName + ' ' + trip?.driver?.user.lastName +
                                        ' στις ' + formattedDate + ' απορρίφθηκε';
            // console.log(passengerMessage);

            const role: string = await checkIfRecipientIsDriver();
            //* update notification to rejected
            await instance.put(`/notifications/${notificationDetails.notificationId}`, {
                status: 'declined'
            });
            
            //* create notification for the user that requested to join the trip
            await instance.post(`/notifications`, {
                driverId: notificationDetails.driverId,
                passengerId: notificationDetails.passengerId,
                tripId: notificationDetails.tripId,    
                message: passengerMessage,
                stopId: notificationDetails.stopId,
                status: 'declined',
                recipient: role,
                type: 'request'
            });
            
        } catch (error) {
            console.log("Error rejecting notification", error);
        }
    }

    const handleAccept = async () => {
        try {
            if(Number(userId) === notificationDetails.driverId && trip) {
                const passengerMessage = 'Η αίτηση σας για συμμετοχή στη διαδρομή του/της ' + 
                                            trip?.driver?.user.firstName + ' ' + trip?.driver?.user.lastName +
                                            ' στις ' + formattedDate + ' εχει γίνει αποδεκτή';

                const role: string = await checkIfRecipientIsDriver();

                //* update notification to accepted
                await instance.put(`/notifications/${notificationDetails.notificationId}`, {
                    status: 'accepted'
                });
                
                //* create notification for the user that requested to join the trip
                await instance.post(`/notifications`, {
                    driverId: notificationDetails.driverId,
                    passengerId: notificationDetails.passengerId,
                    tripId: notificationDetails.tripId,    
                    message: passengerMessage,
                    stopId: notificationDetails.stopId,
                    status: 'accepted',
                    recipient: role,
                    type: 'request'
                });

                const passengerName = await instance.get(`/user/${notificationDetails.passengerId}`);
                console.log("Notification details", notificationDetails);
                
                //* update trip with new passenger and stop
                await instance.patch(`/trips/${notificationDetails.tripId}`, {
                    userId: notificationDetails.driverId,
                    addPassengers: [{
                        firstName: passengerName.data.firstName,
                        lastName: passengerName.data.lastName
                    }],
                    addStops: [
                        notificationDetails.stopId
                    ]
                });

                //* update user's current trip 
                await instance.put(`/user/${notificationDetails.passengerId}`, {
                    currentTripId: notificationDetails.tripId
                })
            }
            
        } catch (error) {
            console.log("Error accepting notification", error);
        }
    }

    const checkIfRecipientIsDriver = async (): Promise<string> => {
        try {
            const recipient = await instance.get(`/user/${notificationDetails.passengerId}`);
            let role: string;
            //logic to determine the role of the recipient in order for the notifications to be filtered correctly
            //when a driver wants to join a trip as a passenger
            if(recipient.data.role === 'driver' && trip?.driverId !== notificationDetails.passengerId) {
                role = 'driver';
            } else {
                role = 'passenger';
            }
            return role;
        } catch (error) {
            console.log("Error checking if recipient is driver", error);
            return ''; // Add a return statement to handle the error case
        }
    }

    const displayAppropriateTitle = () => {
        if(notificationDetails.type === 'request'){
            if(displayAcceptReject){
                return 'Αίτηση συμμετοχής σε διαδρομή σας';
            } else 
                return 'Αίτηση συμμετοχής σε διαδρομή';
        } else if (notificationDetails.type === 'review'){
            return 'Αξιολόγηση Συνεπιβατών';
        }
    }

    const retrieveTripInfo = async () => {
        try {
            const tripMentioned = await instance.get(`/trips/${notificationDetails.tripId}`);
            console.log(tripMentioned);
            setTrip(tripMentioned.data);

            const {formattedDate, formattedTime} = formatDateTime(tripMentioned.data.startingTime);
            setFormattedDate(formattedDate);
            setFormattedTime(formattedTime);
        } catch (error) {
            console.log("Error retrieving trip info", error);
        }
    }

    useEffect(() => {
        if(accepted) {
            console.log('Accepted', accepted);
            handleAccept();
        }
    }, [accepted]);

    useEffect(() => {
        if(rejected) {
            console.log('Rejected', rejected);
            handleReject();
        }
    }, [rejected]);

    useEffect(() => {
        retrieveTripInfo();
    }, []);

    useEffect(() => {
        if(trip){
            const tripParticipantsTemp: {firstName: string, lastName:string}[] = [];
            if(trip.driverId === Number(userId))
                setDisplayAcceptReject(true);
            if(trip.driver)
                setTripParticipants([...tripParticipants, { firstName: trip.driver?.user.firstName, lastName: trip.driver?.user.lastName }]);
            trip.tripPassengers.forEach( (tripPassenger) => {
                tripParticipantsTemp.push({firstName: tripPassenger.passenger.firstName, lastName: tripPassenger.passenger.lastName});
            });
            setTripParticipants([...tripParticipants, ...tripParticipantsTemp]);
        }
    }, [trip]);

    return (
        <IonCard style={{borderRadius: '1rem', color: 'black'}} color="primary">
            <IonCardHeader>
                <IonCardTitle class="ion-text-center">
                    {
                        displayAppropriateTitle()
                    }
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent style={{padding: '0rem'}}>
                <div className="notification-message" style={{display: 'flex', textAlign: 'center'}}>
                    {notificationDetails.message}
                </div>
                <div className="trip-display-container" style={{width: '100%'}}>
                    {
                        
                        trip ? (
                            <TripInformation 
                                startingTime={formattedTime} 
                                dateOfTrip={formattedDate} 
                                origin={trip.startLocation}
                                noOfPassengers={trip.noOfPassengers}
                                noOfStops={trip.noOfStops}
                                finish='Πρυτανεία'
                                driver={{
                                        user: trip.driver? trip.driver.user : {
                                            firstName: 'Δεν υπάρχει οδηγός ακόμα',
                                            lastName: '',
                                            overallRating: '0'
                                        },
                                        vehicle: trip.driver? trip.driver.vehicle : {
                                            noOfSeats: 0,
                                            maker: '',
                                            model: ''
                                        }
                                    }
                                }
                                tripCreator ={trip.tripCreator}
                            />
                        ) : ''
                    }
                </div>
            </IonCardContent>
            { 
                displayAcceptReject && notificationDetails.type === 'request' &&
                    <div style={{display: 'flex', alignItems: 'center' , justifyContent: 'center', }}>
                        <IonButton color="danger" onClick={() => setRejected(true)}>Απορριψη</IonButton>
                        <IonButton color="success" onClick={() => setAccepted(true)}>Αποδοχη</IonButton>
                    </div>
            }
            {
                notificationDetails.type === 'review' &&
                    <div className="rating-container">
                        <IonText>Πως σας φάνηκε ο/η </IonText>
                        <Swiper
                            navigation
                            pagination={{ clickable: true }}
                            style={{width: '100%'}}
                        >
                        {
                            tripParticipants.map((participant, index) => (
                                <SwiperSlide key={index} >
                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                        <IonText>{participant.firstName} {participant.lastName}</IonText>
                                        <Rating
                                            name="half-rating"
                                            className="rating"
                                            precision={0.5}
                                            value={userRating}
                                            onChange={(event, newValue) => {
                                                if (newValue !== null)
                                                    setUserRating(newValue); 
                                            }}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))
                        }
                        </Swiper>                      
                        <IonButton color="success">Υποβολη</IonButton>
                    </div>  
            }
        </IonCard>
    );
}