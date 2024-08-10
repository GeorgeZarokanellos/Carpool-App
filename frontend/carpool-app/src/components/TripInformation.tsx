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
        carOutline,
        starOutline,
    } from 'ionicons/icons';
import './TripInformation.scss';
import { StarRating } from "../util/common_functions";
import { TripTitle } from "./TripTitle";

export const TripInformation: React.FC<TripProps>  = ({startingTime, dateOfTrip, origin, noOfPassengers, finish, driver, tripCreator}) => {
    const itemColor = "";   //TODO change to background color of the app

    return (
    <IonCol size="12" >
        <IonCard className="trip-info-container" color={itemColor}>
            <IonCardHeader >
                <IonCardTitle className="custom-font">
                    <TripTitle dateOfTrip={dateOfTrip} tripCreator={tripCreator}/>
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="ion-justify-content-center ion-align-items-center custom-content">
                <IonGrid>
                    <IonRow >
                        <div className="start-finish">
                            <IonCol size="5">
                                <div className="start-location">
                                    <IonItem lines="none" color={itemColor} >
                                        <IonIcon icon={locationOutline} slot="start" className="location-icon" />
                                        <IonLabel >
                                            {origin}
                                        </IonLabel>
                                    </IonItem>
                                </div>
                            </IonCol>
                            <IonCol size="1">
                                <div className="arrow-container">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="30px" viewBox="0 0 16 16"><path fill="black" fillRule="evenodd" d="M10.159 10.72a.75.75 0 1 0 1.06 1.06l3.25-3.25L15 8l-.53-.53l-3.25-3.25a.75.75 0 0 0-1.061 1.06l1.97 1.97H1.75a.75.75 0 1 0 0 1.5h10.379z" clipRule="evenodd"></path></svg>
                                </div>
                            </IonCol>
                            <IonCol size="6">
                                <div className="end-location">
                                    <IonItem lines="none" color={itemColor} >
                                            <IonText>
                                                {finish}
                                            </IonText>
                                            <IonIcon icon={flagOutline} slot="end" className="flag-icon" />
                                    </IonItem>
                                </div>
                            </IonCol>
                        </div>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6" >
                            <div className="time-people-container">
                                <IonItem lines="none" color={itemColor}>
                                    <IonIcon icon={timeOutline} slot="start" className="time-icon" />
                                    <IonLabel>{startingTime}</IonLabel>
                                </IonItem>
                                <IonItem lines="none" color={itemColor}>
                                    <IonIcon icon={peopleOutline} slot="start" className="people-icon" />
                                    {noOfPassengers + ' Συνεπιβ.'}
                                </IonItem>
                            </div>
                        </IonCol>
                        <IonCol size="6" className="">
                            <div className="driver-info-container">
                                <IonItem lines="none" color={itemColor} >
                                        <IonLabel >{(driver? driver.user.firstName + ' ' + driver.user.lastName : 'No driver yet')}</IonLabel>
                                        {/* <IonIcon icon={carOutline} className="car-icon" slot="end"/> */}
                                </IonItem>
                                <IonItem lines="none" color={itemColor} >
                                    < StarRating rating={Number(driver.user.overallRating)}/>
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
