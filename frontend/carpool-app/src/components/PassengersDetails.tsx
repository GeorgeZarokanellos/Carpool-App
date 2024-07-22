import React from "react";
import { tripPassenger } from "../interfacesAndTypes/Types";
import { IonAvatar, IonIcon, IonImg, IonItem, IonLabel } from "@ionic/react";
import './PassengersDetails.scss';
import { arrayBufferTo64String } from "../util/common_functions";

interface PassengersDetailsProps{
    passengers: tripPassenger[];
}

export const PassengersDetails: React.FC<PassengersDetailsProps> = ({passengers}) => {
    console.log("Passengers: ", passengers);
    // console.log("Passenger profile picture: ", arrayBufferTo64String(passengers[0].passenger.profilePicture));
    
    return (
        <div className="passenger-item">
            {passengers.map((passenger,index) => {
                return (
                    <IonItem key={index} lines="none">
                        <IonAvatar >
                                <img  
                                src={passenger.passenger.profilePicture? arrayBufferTo64String(passenger.passenger.profilePicture) : "https://ionicframework.com/docs/img/demos/avatar.svg" }
                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            />
                        </IonAvatar>
                        <IonLabel >{passenger.passenger.firstName + ' ' + passenger.passenger.lastName}</IonLabel>
                    </IonItem>
                );
            })}
        </div>
    )
}