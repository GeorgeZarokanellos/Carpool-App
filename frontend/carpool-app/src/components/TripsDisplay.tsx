import React, { useState } from "react";
import { Trip } from "../interfacesAndTypes/Types";
import { IonButton, IonItem, IonList, IonText, IonTitle } from "@ionic/react";
import './TripsDisplay.scss';

interface TripsDisplayProps{
    tripsParticipated: Trip[];
    tripsCreated: Trip[];
}

export const TripsDisplay: React.FC<TripsDisplayProps> = ({tripsCreated, tripsParticipated}) => {
    const [selectedList, setSelectedList] = useState<string>("created");
    const [createdTripsButtonColor, setCreateTripsButtonColor] = useState<string>('secondary');
    const [participatedTripsButtonColor, setParticipatedTripsButtonColor] = useState<string>('primary');
    const formatDate = (dateString: Date) => {
        const parts = dateString.toString().split('-');
        const formattedDate = `${parts[1]}/${parts[2]}`;
        return formattedDate;
    }
    let formattedDate;
    
    return (
        <div className="trip-display-container">
            <IonTitle>User Trips</IonTitle>
            <div className="trip-type-picker">
                <IonButton onClick={() => {
                    setSelectedList("created");
                    setCreateTripsButtonColor('secondary');
                    setParticipatedTripsButtonColor('primary');
                }
                } color={createdTripsButtonColor}>Created</IonButton>
                <IonButton onClick={() => {
                    setSelectedList("participated");
                    setParticipatedTripsButtonColor('secondary');
                    setCreateTripsButtonColor('primary');
                }
                } color={participatedTripsButtonColor}>Participated</IonButton>
            </div>
            <div className="trips-list">
                {selectedList === "created" ? (
                    <IonList >
                        {tripsCreated.map((trip) => {
                            console.log(trip);
                            
                            // console.log(review.reviewDateTime);
                            // console.log(review);
                            
                            return (
                                <IonItem lines='none' key={trip.tripId} className="review-container" color='primary'>
                                    <div className="item-contents">
                                        <IonText>
                                            {trip.driver? (trip.driver.user.firstName + trip.driver.user.lastName):('No driver yet')}
                                        </IonText>
                                    </div>
                                </IonItem>
                            )
                        })}
                    </IonList>
                ):(
                    <IonList>
                        {/* {submittedReviews.map((review) => {
                            // console.log(review.reviewDateTime);
                            // console.log(review.reviewRating);
                            
                            return (
                                <IonItem lines='none' key={review.reviewId} className="review-container" color='primary'>
                                    <div className="item-contents">
                                        <IonText>
                                            Submitted by {review.reviewer.firstName + ' ' + review.reviewer.lastName} 
                                            {' at ' + formatDate(review.reviewDateTime)}
                                        </IonText>
                                        <StarRating rating={review.reviewRating} />
                                    </div>
                                </IonItem>
                            )
                        })} */}
                    </IonList>
                )}
            </div>
        </div>
    );
}