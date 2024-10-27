import React from "react";
import { tripPassenger } from "../../interfacesAndTypes/Types";
import { IonAvatar, IonItem, IonLabel } from "@ionic/react";
import './PassengersDetails.scss';
import { arrayBufferTo64String, StarRating } from "../../util/common_functions";

interface PassengersDetailsProps{
    passengers: tripPassenger[];
}

export const PassengersDetails: React.FC<PassengersDetailsProps> = ({passengers}) => {
    return (
        <div className="passengers-details">
            <div className="passenger-item">
                {passengers.map((passenger,index) => {
                    const passengerRating = parseFloat(passenger.passenger.overallRating);
                    return (
                        <IonItem key={index} lines="none" >
                                <IonAvatar style={{maxWidth: '3.5rem'}}>
                                        <img  
                                        src={passenger.passenger.profilePicture? arrayBufferTo64String(passenger.passenger.profilePicture) : "https://ionicframework.com/docs/img/demos/avatar.svg" }
                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                    />
                                </IonAvatar>
                                <div className="name-rating">
                                    <IonLabel class="ion-text-center">{passenger.passenger.firstName + ' ' + passenger.passenger.lastName} </IonLabel>
                                    <StarRating rating={passengerRating} />
                                </div>
                        </IonItem>
                    );
                })}
            </div>
        </div>
    )
}