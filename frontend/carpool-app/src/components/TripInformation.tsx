import React from "react";
import { IonCard, IonCardContent, IonCardHeader, IonIcon, IonItem, IonGrid, IonRow, IonCol, IonLabel } from "@ionic/react";
import { TripProps } from "../interfacesAndTypes/Interfaces";
import { 
        timeOutline, 
        peopleOutline, 
        pinOutline, 
        locationOutline, 
        flagOutline,
        star,
        car,
    } from 'ionicons/icons';
import './TripInformation.css';

export const TripInformation: React.FC<TripProps>  = ({time, origin, noOfPassengers, noOfStops, finish}) => (
    <IonCard className="trip-info-container">
        <IonCardHeader></IonCardHeader>
        <IonCardContent className="card-content">
            <IonGrid>
                <IonRow>
                    <IonCol size="4">
                        <div className="">
                            <IonItem lines="none">
                                <IonIcon icon={timeOutline} slot="start" className="time-icon"/>
                                <IonLabel>{time}</IonLabel>
                            </IonItem>
                            <IonItem lines="none">
                                <IonIcon icon={peopleOutline} slot="start" className="people-icon"/>
                                {noOfPassengers}
                            </IonItem>
                            <IonItem lines="none">
                                <IonIcon icon={pinOutline} slot="start" className="pin-icon"/>
                                {noOfStops}
                            </IonItem>
                        </div>
                    </IonCol>
                    <IonCol size="4">
                        <div className="">
                            <IonItem lines="none">
                                <IonIcon icon={locationOutline} slot="start" className="location-icon"/>
                                {origin}
                            </IonItem>
                            <IonItem lines="none">
                                <IonIcon icon={flagOutline} slot="start" className="flag-icon"/>
                                {finish}
                            </IonItem>
                        </div>
                    </IonCol>
                    <IonCol size="4">
                        <div>
                            <IonItem lines="none">
                                George
                                <IonIcon icon={car} className="flag-icon"/>
                            </IonItem>
                            <div className="stars">
                                <IonIcon icon={star} className="star-icon" />
                                <IonIcon icon={star} className="star-icon" />
                                <IonIcon icon={star} className="star-icon" />
                                <IonIcon icon={star} className="star-icon" />
                                <IonIcon icon={star} className="star-icon" />
                            </div>
                        </div>
                    </IonCol>
                </IonRow>
            </IonGrid> 
        </IonCardContent>
    </IonCard>
);
