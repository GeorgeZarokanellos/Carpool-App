import { IonButton, IonItem, IonList, IonText, IonTitle } from "@ionic/react";
import React, { useState } from "react";
import { Review } from "../interfacesAndTypes/Types";
import './ReviewsDisplay.scss';
import { StarRating } from "../util/common_functions";
import { formatDate } from "../util/common_functions";

interface SRReviewsDisplayProps {
    submittedReviews: Review[]; 
    userReviews: Review[];
}

export const SubmittedReceivedReviewsDisplay: React.FC<SRReviewsDisplayProps> = ({submittedReviews, userReviews}) => {

    const [selectedList, setSelectedList] = useState<string>("received");
    const [receivedButtonColor, setReceivedButtonColor] = useState<string>('secondary');
    const [submittedButtonColor, setSubmittedButtonColor] = useState<string>('primary');

    let formattedDate;
    // console.log("Received reviews from component", userReviews);
    // console.log("Submitted reviews from component", submittedReviews);
    // console.log(selectedList === "received");
    
    return (
        <div className="review-display-container">
            <IonTitle>User Reviews</IonTitle>
            <div className="review-type-picker">
                <IonButton onClick={() => {
                    setSelectedList("received");
                    setReceivedButtonColor('secondary');
                    setSubmittedButtonColor('primary');
                }
                } color={receivedButtonColor}>Received</IonButton>
                <IonButton onClick={() => {
                    setSelectedList("Submitted");
                    setSubmittedButtonColor('secondary');
                    setReceivedButtonColor('primary');
                }
                } color={submittedButtonColor}>Submitted</IonButton>
            </div>
            <div className="reviews-list">
                {selectedList === "received" ? (
                    <IonList >
                        {userReviews.map((review) => {
                            // console.log(review.reviewDateTime);
                            // console.log(review);
                            
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
                        })}
                    </IonList>
                ):(
                    <IonList>
                        {submittedReviews.map((review) => {
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
                        })}
                    </IonList>
                )}
            </div>
        </div>
    );
}