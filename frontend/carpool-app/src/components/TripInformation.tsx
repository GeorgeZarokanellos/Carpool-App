import React from "react";
import { IonCard, IonCardContent, IonCardHeader, IonIcon, IonItem, IonGrid, IonRow, IonCol, IonLabel } from "@ionic/react";
import { TripProps } from "../interfacesAndTypes/Interfaces";
import { timeOutline, peopleOutline, pinOutline, locationOutline, flagOutline } from 'ionicons/icons';
import './TripInformation.css';

export const TripInformation: React.FC<TripProps>  = ({time, origin, noOfPassengers, noOfStops}) => (
    <IonCard>
        <IonCardHeader></IonCardHeader>
        <IonCardContent>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <div className="">
                            <IonItem>
                                <IonIcon icon={timeOutline} slot="start" className="time-icon"/>
                                <IonLabel>{time}</IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonIcon icon={peopleOutline} slot="start" className="people-icon"/>
                                {noOfPassengers}
                            </IonItem>
                            <IonItem>
                                <IonIcon icon={pinOutline} slot="start" className="pin-icon"/>
                                {noOfStops}
                            </IonItem>
                        </div>
                    </IonCol>
                    <IonCol>
                        <div className="">
                            <IonItem>
                                <IonIcon icon={locationOutline} slot="start" className="location-icon"/>
                                {origin}
                            </IonItem>
                            <IonItem>
                                <IonIcon icon={flagOutline} className="flag-icon"/>
                            </IonItem>
                        </div>
                    </IonCol>
                </IonRow>
            </IonGrid> 
        </IonCardContent>
    </IonCard>
);
