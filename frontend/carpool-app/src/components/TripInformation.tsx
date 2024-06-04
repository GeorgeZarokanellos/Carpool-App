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
        IonCardTitle, 
        IonText
    } from "@ionic/react";
import { TripProps } from "../interfacesAndTypes/Interfaces";
import { 
        timeOutline, 
        peopleOutline, 
        locationOutline, 
        flagOutline,
        starOutline,
        car,
        arrowForward,
    } from 'ionicons/icons';
import './TripInformation.scss';

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
            <IonCardContent className="ion-justify-content-center ion-align-items-center custom-content">
                <IonGrid>
                    <IonRow>
                        {/* <div className="start-finish"> */}
                            <IonCol size="5">
                                <div className="column-contents">
                                    <IonItem lines="none">
                                        <IonIcon icon={locationOutline} slot="start" className="location-icon" />
                                        <IonLabel >
                                            {origin}
                                        </IonLabel>
                                    </IonItem>
                                </div>
                            </IonCol>
                            <IonCol size="2">
                                <div className="arrow-container">
                                    {/* <IonItem lines="none"> */}
                                        <IonIcon icon={arrowForward} className="arrow-icon"/>
                                    {/* </IonItem> */}
                                </div>
                            </IonCol>
                            <IonCol size="5">
                                <div className="column-contents">
                                    <IonItem lines="none">
                                        <div className="destination">
                                            <IonIcon icon={flagOutline} slot="start" className="flag-icon" />
                                            <IonText>
                                                {finish}
                                            </IonText>
                                        </div>
                                    </IonItem>
                                </div>
                            </IonCol>
                        {/* </div> */}
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
                                    <div className="position-end">  {/* TODO: Fix the position of this div to the end of the container */}
                                        <IonIcon icon={car} className="car-icon" />
                                        <IonText>{(driver? driver.user.firstName + ' ' + driver.user.lastName : 'No driver yet')}</IonText>
                                    </div>
                                </IonItem>
                                <IonItem lines="none">
                                    <div className="position-end">
                                        <IonIcon icon={starOutline} className="star-icon" />
                                        <IonIcon icon={starOutline} className="star-icon" />
                                        <IonIcon icon={starOutline} className="star-icon" />
                                        <IonIcon icon={starOutline} className="star-icon" />
                                        <IonIcon icon={starOutline} className="star-icon" />
                                    </div>
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
