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
        arrowForward,
    } from 'ionicons/icons';
import './TripInformation.css';

export const TripInformation: React.FC<TripProps>  = ({startingTime, dateOfTrip, origin, noOfPassengers, noOfStops, finish}) => (
    <IonCol size="12">
        <IonCard className="trip-info-container">
            <IonCardHeader></IonCardHeader>
            <IonCardContent className="card-content">
                <IonGrid>
                    <IonRow >
                        <div className="start-finish">
                            <IonItem lines="none">
                                <IonIcon icon={locationOutline} slot="start" className="location-icon" />
                                {origin}
                            </IonItem>
                            <IonItem lines="none">
                                <IonIcon icon={arrowForward} />
                            </IonItem>
                            <IonItem lines="none">
                                <IonIcon icon={flagOutline} slot="start" className="flag-icon" />
                                {finish}
                            </IonItem>
                        </div>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6" >
                            <div className="">
                                <IonItem lines="none">
                                    <IonIcon icon={timeOutline} slot="start" className="time-icon" />
                                    <IonLabel>{startingTime}</IonLabel>
                                </IonItem>
                                <IonItem lines="none">
                                    <IonIcon icon={peopleOutline} slot="start" className="people-icon" />
                                    {noOfPassengers}
                                </IonItem>
                            </div>
                        </IonCol>
                        <IonCol size="6" >
                            <div>
                                <IonItem lines="none">
                                    George
                                    <IonIcon icon={car} className="flag-icon" />
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
    </IonCol>
);
