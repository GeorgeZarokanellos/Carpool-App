import React, { useEffect, useState } from "react";
import { NotificationInterface } from "../interfacesAndTypes/Interfaces";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText } from "@ionic/react";
import instance from "../AxiosConfig";
import { ExtendedTrip} from "../interfacesAndTypes/Types";
import { TripInformation } from "./TripInformation";
import { formatDateTime } from "../util/common_functions";
import Rating from "@mui/material/Rating";
import './NotificationDisplay.scss';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination} from 'swiper/modules';
import { tripStatus } from "../interfacesAndTypes/Types";

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
    const [usersRating, setUsersRating] = useState<{participantId: number, rating: number}[]>([]);
    const [tripParticipants, setTripParticipants] = useState<{firstName: string, lastName: string, participantId: number, role: string}[]>([]);
    const [tripParticipantsSet, setTripParticipantsSet] = useState<boolean>(false);
    const userId = localStorage.getItem('userId');

    const handleReject = async () => {
        try {
            const passengerMessage = 'Your request to join the trip of ' + 
                                        trip?.driver?.user.firstName + ' ' + trip?.driver?.user.lastName +
                                        ' at ' + formattedDate + ' has been rejected.';

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
        

            alert("You have rejected the request");
            window.location.reload();

        } catch (error) {
            console.log("Error rejecting notification", error);
        }
    }

    const handleAccept = async () => {
        try {
            if(Number(userId) === notificationDetails.driverId && trip) {
                const passengerMessage = 'Your request to join the trip of ' + 
                                            trip?.driver?.user.firstName + ' ' + trip?.driver?.user.lastName +
                                            ' at ' + formattedDate + ' has been accepted!';

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
                });

                const tripIsFull = await checkTripCapacityAndUpdateStatus(notificationDetails.tripId);
                if(tripIsFull === true){
                    alert("You have accepted the request and the trip is now full!");
                } else {
                    alert("You have accepted the request!");
                } 

                window.location.reload();
            }
            
        } catch (error) {
            console.log("Error accepting notification", error);
            throw new Error("One or more operations wasnt succesful" + error);
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
                return 'Request to join your trip';
            } else 
                return 'Request to join a trip';
        } else if (notificationDetails.type === 'review'){
            return 'Trip participants review';
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

    const handleReviewSubmission = () => {
        try {
            if(usersRating){
                const promises = usersRating.map( async (usersRating) => {
                    await instance.post(`/reviews/${notificationDetails.tripId}`, {
                        reviewRating: usersRating.rating,
                        reviewerId: Number(userId),
                        reviewedUserId: usersRating.participantId
                    })
                    .then( (response) => {
                        console.log(`Review submitted for user ${usersRating.participantId}`, response);
                        return response;
                    })
                    .catch( (error) => {
                        console.log(`Error submitting review for user ${usersRating.participantId}`, error);
                        throw error;
                    })
                })
                
                Promise.all(promises)
                .then(async (response) => {
                    console.log("All reviews submitted", response);
                    console.log("Promises", promises.length);
                    
                    //add 1 point to the user's overall points for each review submitted
                    await instance.put(`/user/${userId}?type=points`,{
                        overallPoints: promises.length
                    });
                    alert(`Your reviews have been submitted and you have been awarded ${promises.length} points!`);
                    await instance.put(`/notifications/${notificationDetails.notificationId}`, {
                        status: 'reviewed'
                    });
                    window.location.reload();
                    
                })
                .catch((error) => {
                    console.log("Error submitting reviews", error);
                })
            } else {
                console.log("No users to rate");
            }
        } catch (error) {
            console.log("Error handling reviews", error);
            
        }
    }

    const checkTripCapacityAndUpdateStatus = async (tripId: number): Promise<boolean> => {
        try {
            let tripIsFull = false;
            const response = await instance.get(`/trips/${tripId}`);
            const tripData: ExtendedTrip = response.data;
            console.log("Trip data", tripData);
            
            if(tripData.driver){
                //check if trip is full after accepting a request
                if(tripData.noOfPassengers + 1 === tripData.driver.vehicle.noOfSeats){
                    await instance.patch(`/trips/${notificationDetails.tripId}`, {
                        status: tripStatus.LOCKED
                    });
                    tripIsFull = true;
                    //check if trip is not full after rejecting a request
                } 
            } else {
                console.log("No driver for the trip");
                throw new Error("No driver for the trip");
            }
            return tripIsFull;
        } catch (error) {
            console.log("Error checking if trip is full", error);
            throw new Error("Error checking if trip is full");
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
        if(trip && !tripParticipantsSet) {
            const tripParticipantsTemp: {firstName: string, lastName:string, participantId: number, role: string}[] = [];
            if(trip.driverId === Number(userId))
                setDisplayAcceptReject(true);
            if(trip.driver && trip.driverId && trip.driverId !== Number(userId)){
                tripParticipantsTemp.push(
                    {
                        firstName: trip.driver.user.firstName, 
                        lastName: trip.driver.user.lastName,
                        participantId: trip.driverId,
                        role: 'driver'
                    });
            }
            trip.tripPassengers.forEach( (tripPassenger) => {
                if(tripPassenger.passengerId !== Number(userId)){
                    tripParticipantsTemp.push(
                        {
                            firstName: tripPassenger.passenger.firstName, 
                            lastName: tripPassenger.passenger.lastName,
                            participantId: tripPassenger.passengerId,
                            role: 'passenger'
                        });
                }
            });
            setTripParticipants(tripParticipantsTemp);
            setTripParticipantsSet(true);
        }

    }, [trip]);

    return (
        <IonCard color="primary">
            <IonCardHeader>
                <IonCardTitle class="ion-text-center">
                    {
                        displayAppropriateTitle()
                    }
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="card-content">
                <div className="notification-message">
                    {notificationDetails.message}
                </div>
                <div className="trip-display-container">
                    {
                        
                        trip ? (
                            <TripInformation 
                                startingTime={formattedTime} 
                                dateOfTrip={formattedDate} 
                                startLocation={trip.startLocation.stopLocation}
                                endLocation={trip.endLocation.stopLocation}
                                noOfPassengers={trip.noOfPassengers}
                                noOfStops={trip.noOfStops}
                                driver={{
                                        user: trip.driver? trip.driver.user : {
                                            firstName: 'There is no driver yet',
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
                { 
                    displayAcceptReject && notificationDetails.type === 'request' &&
                        <div style={{display: 'flex', alignItems: 'center' , justifyContent: 'center', }}>
                            <IonButton color="success" onClick={() => setAccepted(true)}>Accept</IonButton>
                            <IonButton color="danger" onClick={() => setRejected(true)}>Reject</IonButton>
                        </div>
                }
                {
                    notificationDetails.type === 'review' &&
                        <div className="rating-container">
                            <IonText>How would you rate </IonText>
                            <Swiper
                                pagination={true}
                                className="my-swiper"
                                modules={[Pagination]}
                            >
                            {
                                tripParticipants.map((participant, index) => (
                                    <SwiperSlide key={index} style={{height: '4rem'}}>
                                        <div
                                            style={
                                                {
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    alignItems: 'center',
                                                    height: '100%',
                                                }
                                            }>
                                            <IonText>{participant.firstName} {participant.lastName} {" (" + participant.role + ")"}</IonText>
                                            <Rating
                                                name="half-rating"
                                                className="rating"
                                                precision={0.5}
                                                defaultValue={0}
                                                value={usersRating.find((userRating) => userRating.participantId === participant.participantId)?.rating || 0}
                                                onChange={(event, newValue) => {
                                                    if(newValue !== null ){
                                                        const index = usersRating.findIndex((userRating) => userRating.participantId === participant.participantId); 
                                                        if(index !== -1){
                                                            //updated version of the usersRating array
                                                            const updatedUsersRating = [...usersRating];
                                                            //update the rating of the user whose id is the same as the id of the user that was rated
                                                            updatedUsersRating[index].rating = newValue;
                                                            //update the state with the updated array
                                                            setUsersRating(updatedUsersRating);
                                                        } else {
                                                            setUsersRating([...usersRating, {participantId: participant.participantId, rating: newValue}]); 
                                                        }
                                                    }
                                                }}
                                                
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))
                            }
                            </Swiper>                      
                            <IonButton color="success" onClick={handleReviewSubmission}>Submit Review</IonButton>
                        </div>  
                }
            </IonCardContent>
        </IonCard>
    );
}