import { IonButton, IonItem, IonList, IonText, IonTitle } from "@ionic/react";
import React, { useState } from "react";
import { Review } from "../interfacesAndTypes/Types";
import './ReviewsDisplay.scss';
import { formatDateTime, StarRating } from "../util/common_functions";

interface SRReviewsDisplayProps {
    submittedReviews: Review[]; 
    userReviews: Review[];
}

export const SubmittedReceivedReviewsDisplay: React.FC<SRReviewsDisplayProps> = ({submittedReviews, userReviews}) => {

    const [selectedList, setSelectedList] = useState<string>("received");
    const [receivedButtonColor, setReceivedButtonColor] = useState<string>('secondary');
    const [submittedButtonColor, setSubmittedButtonColor] = useState<string>('primary');
    
    return (
        <div className="review-display-container">
            <IonTitle>User Reviews</IonTitle>
            <div className="review-type-picker">
                <IonButton onClick={() => {
                    setSelectedList("received");
                    setReceivedButtonColor('secondary');
                    setSubmittedButtonColor('primary');
                }
                } color={receivedButtonColor}><IonText style={{color: 'white'}}>Received</IonText></IonButton>
                <IonButton  onClick={() => {
                    setSelectedList("Submitted");
                    setSubmittedButtonColor('secondary');
                    setReceivedButtonColor('primary');
                }
                } color={submittedButtonColor}><IonText style={{color: 'white'}}>Submitted</IonText></IonButton>
            </div>
            <div className="reviews-list">
                {selectedList === "received" ? (
                    <IonList >
                        {userReviews.map((review, index) => {
                            const { formattedDate, formattedTime } = formatDateTime(review.reviewDateTime);
                            return (
                                <IonItem lines='none' key={index} className="review-container" color='primary'>
                                    <div className="item-contents">
                                        <IonText >
                                            Submitted by {review.reviewer.firstName + ' ' + review.reviewer.lastName} 
                                            {' at ' + formattedTime + ' on ' + formattedDate}
                                        </IonText>
                                        <StarRating rating={Number(review.reviewRating)} />
                                    </div>
                                </IonItem>
                            )
                        })}
                    </IonList>
                ):(
                    <IonList >
                        {submittedReviews.map((review, index) => {
                            const { formattedDate, formattedTime } = formatDateTime(review.reviewDateTime);
                            return (
                                <IonItem lines='none' key={index} className="review-container" color='primary'>
                                    <div className="item-contents">
                                        <IonText>
                                            Submitted by {review.reviewer.firstName + ' ' + review.reviewer.lastName} 
                                            {' at '+ formattedTime + ' on ' + formattedDate}
                                        </IonText>
                                        <StarRating rating={Number(review.reviewRating)} />
                                    </div>
                                </IonItem>
                            )
                        })}
                    </IonList>
                )}
            </div>
        </div>
    );
}