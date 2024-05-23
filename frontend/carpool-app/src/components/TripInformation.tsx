import React from "react";
import { 
        IonCard, 
        IonCardContent, 
        IonCardHeader, 
        IonIcon, 
        IonItem, 
        IonGrid, 
        IonRow, 
        IonCol, 
        IonLabel, 
        IonCardTitle 
    } from "@ionic/react";
import { TripProps } from "../interfacesAndTypes/Interfaces";
import { 
        timeOutline, 
        peopleOutline, 
        pinOutline, 
        locationOutline, 
        flagOutline,
        starOutline,
        car,
        arrowForward,
    } from 'ionicons/icons';
import './TripInformation.css';

export const TripInformation: React.FC<TripProps>  = ({startingTime, dateOfTrip, origin, noOfPassengers, noOfStops, finish, driver, tripCreator}) => {
    const today = new Date();
    const tripDate = new Date(dateOfTrip);
    //check if trip of date is same as today
    const isTripToday = today.getDate() === tripDate.getDate() &&
                        today.getMonth() === tripDate.getMonth() &&
                        today.getFullYear() === tripDate.getFullYear();

    return (
    <IonCol size="12" >
        <IonCard className="trip-info-container">
            <IonCardHeader>
                <IonCardTitle className="custom-font">
                    {'Διαδρομή του ' + tripCreator.firstName + ' ' + tripCreator.lastName + ' για ' + (isTripToday ? 'σήμερα' : 'της ' + dateOfTrip) }
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="ion-justify-content-center ion-align-items-center">
                <IonGrid>
                    <IonRow>
                        <div className="start-finish">
                            <IonItem lines="none" className="origin-finish-item" >
                                <IonIcon icon={locationOutline} slot="start" className="location-icon" />
                                <IonLabel >
                                    {origin}
                                </IonLabel>
                            </IonItem>
                            <IonItem lines="none" className="arrow-item">
                                <IonIcon icon={arrowForward} />
                            </IonItem>
                            <IonItem lines="none" className="origin-finish-item">
                                <IonIcon icon={flagOutline} slot="start" className="flag-icon" />
                                <IonLabel >
                                    {finish}
                                </IonLabel>
                            </IonItem>
                        </div>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6" >
                            <div className="time-people-container">
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
                        <IonCol size="6" className="">
                            <div className="driver-info-container">
                                <IonItem lines="none" className="">
                                    <IonIcon icon={car} className="car-icon" />
                                    <IonLabel>{(driver? driver.user.firstName + ' ' + driver.user.lastName : 'No driver yet')}</IonLabel>
                                </IonItem>
                                <IonItem lines="none">
                                    <IonIcon icon={starOutline} className="star-icon" />
                                    <IonIcon icon={starOutline} className="star-icon" />
                                    <IonIcon icon={starOutline} className="star-icon" />
                                    <IonIcon icon={starOutline} className="star-icon" />
                                    <IonIcon icon={starOutline} className="star-icon" />
                                </IonItem>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid> 
            </IonCardContent>
        </IonCard>
    </IonCol>
    );
}
