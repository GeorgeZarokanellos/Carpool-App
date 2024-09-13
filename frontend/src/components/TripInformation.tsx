import React from "react";
import { 
        IonCard, 
        IonCardContent, 
        IonCardHeader, 
        IonItem, 
        IonGrid, 
        IonRow, 
        IonCol, 
        IonCardTitle, 
        IonText
    } from "@ionic/react";
import { TripProps } from "../interfacesAndTypes/Interfaces";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import FlagIcon from '@mui/icons-material/Flag';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import './TripInformation.scss';
import { TripTitle } from "./TripTitle";
import { Rating } from "@mui/material";

export const TripInformation: React.FC<TripProps>  = ({startingTime, dateOfTrip, startLocation, endLocation, noOfPassengers, driver, tripCreator}) => {
    return (
    <IonCol size="12" >
        <IonCard className="trip-info-container" >
            <IonCardHeader >
                <IonCardTitle >
                    <TripTitle dateOfTrip={dateOfTrip} tripCreator={tripCreator}/>
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="ion-justify-content-center ion-align-items-center custom-content">
                <IonGrid>
                    <IonRow >
                        <div className="start-finish">
                            <IonCol size="5">
                                <div className="start-location">
                                    <IonItem lines="none"  >
                                        <LocationOnIcon className="location-icon"/>
                                        <IonText>
                                            {startLocation}
                                        </IonText>
                                    </IonItem>
                                </div>
                            </IonCol>
                            <IonCol size="1">
                                <div className="arrow-container">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="30px" viewBox="0 0 16 16"><path fill="white" fillRule="evenodd" d="M10.159 10.72a.75.75 0 1 0 1.06 1.06l3.25-3.25L15 8l-.53-.53l-3.25-3.25a.75.75 0 0 0-1.061 1.06l1.97 1.97H1.75a.75.75 0 1 0 0 1.5h10.379z" clipRule="evenodd"></path></svg>
                                </div>
                            </IonCol>
                            <IonCol size="6">
                                <div className="end-location">
                                    <IonItem lines="none"  >
                                            <FlagIcon className="flag-icon"/>
                                            <IonText>
                                                {endLocation}
                                            </IonText>
                                    </IonItem>
                                </div>
                            </IonCol>
                        </div>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6" >
                            <div className="time-people-container">
                                <IonItem lines="none" >
                                    <AccessTimeIcon className="time-icon"/>
                                    <IonText>{startingTime}</IonText>
                                </IonItem>
                                <IonItem lines="none" >
                                    <PeopleAltIcon className="people-icon"/>
                                    <IonText>{noOfPassengers + (driver? + 1 : + 0) + ( driver ? '/' + driver.vehicle.noOfSeats + ' Συνεπιβ.' : ' Συνεπιβ.')}</IonText>
                                </IonItem>
                            </div>
                        </IonCol>
                        <IonCol size="6" className="">
                            <div className="driver-info-container">
                                <IonItem lines="none"  >
                                        <DriveEtaIcon className="car-icon"/>
                                        <IonText >{(driver? driver.user.firstName + ' ' + driver.user.lastName : 'Δεν υπάρχει οδηγός ακόμα')}</IonText>
                                </IonItem>
                                <IonItem lines="none" className="rating-container">
                                    <ThumbUpIcon className="thumb-icon"/>
                                    <Rating 
                                        name="read-only" 
                                        className="rating"
                                        value={Number(driver?.user.overallRating)} 
                                        precision={0.5} 
                                        readOnly 
                                        classes={{ iconEmpty: 'custom-rating' }}
                                        />
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
