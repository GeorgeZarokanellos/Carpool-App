import { IonButton, IonItem, IonList, IonText, IonTitle } from "@ionic/react";
import React, { useState } from "react";
import { Review } from "../interfacesAndTypes/Types";
import './ReviewsDisplay.scss';
import { StarRating } from "../util/common_functions";

//TODO: change color when picking type of reviews
//TODO: add material ui star library

interface SRReviewsDisplayProps {
    submittedReviews: Review[]; 
    userReviews: Review[];
}

export const SubmittedReceivedReviewsDisplay: React.FC<SRReviewsDisplayProps> = ({submittedReviews, userReviews}) => {

    const [selectedList, setSelectedList] = useState<string>("received");
    const [disabledReceived, setDisabledReceived] = useState<boolean>(false);
    const [disabledSubmitted, setDisabledSubmitted] = useState<boolean>(true);
    console.log("Received reviews from component", userReviews);
    console.log("Submitted reviews from component", submittedReviews);
    // console.log(selectedList === "received");
    
    return (
        <div className="review-display-container">
            <IonTitle>User Reviews</IonTitle>
            <div className="review-type-picker">
                <IonButton onClick={() => {
                    setSelectedList("received"); 
                    setDisabledSubmitted(true); 
                    setDisabledReceived(false)}
                } disabled={disabledReceived}>Received</IonButton>
                <IonButton onClick={() => {
                    setSelectedList("Submitted"); 
                    setDisabledReceived(true); 
                    setDisabledSubmitted(false)}
                } disabled={disabledSubmitted}>Submitted</IonButton>
            </div>
            <div className="reviews-list">
                {selectedList === "received" ? (
                    <IonList >
                        {userReviews.map((review) => {
                            // console.log(review.reviewDateTime);
                            
                            return (
                                <IonItem lines='none' key={review.reviewId} className="review-container" color='primary'>
                                    <div className="item-contents">
                                        <IonText>
                                            Submitted by {review.reviewer.firstName + review.reviewer.lastName} 
                                            at {review.reviewDateTime.toString()}
                                        </IonText>
                                        <StarRating rating={review.reviewRating} />
                                    </div>
                                </IonItem>
                            )
                        })}
                    </IonList>
                ):(
                    <IonList>

                    </IonList>
                )}
            </div>
        </div>
    );
}