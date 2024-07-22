import { IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonRow, IonTitle } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { ExtendedTrip, Stop, Trip } from "../interfacesAndTypes/Types";
import { TripTitle } from "./TripTitle";
import { formatDateTime } from "../util/common_functions";
import instance from "../AxiosConfig";
import { TripMapDisplay } from "./TripMapDisplay";
import './DetailedTripInformation.scss';
import { peopleOutline, timeOutline } from "ionicons/icons";
import { PassengersDetails } from "./PassengersDetails";


interface detailedTripInfoProps {
    clickedTripId: number;
}

export const DetailedTripInformation: React.FC<detailedTripInfoProps> = ({ clickedTripId }) => {

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight
    const [tripData, setTripData] = useState<ExtendedTrip>();

    useEffect(() => {
        instance.get(`/trips/${clickedTripId}`)
        .then(response => {
            console.log(response.data.tripStops);
            setTripData(response.data);
            // console.log('tripData', tripData);
            
        })
        .catch(error => {
            console.log(error);
        })
    }, [clickedTripId]);

    useEffect(() => {
        console.log('tripData', tripData);
    }, [tripData]);

    return (
        <IonPage style={{height: `${viewportHeight}`, width: `${viewportWidth}`}}>
            { tripData? (
                <IonHeader>
                    <IonTitle>
                        <TripTitle 
                            dateOfTrip={formatDateTime(tripData.startingTime).formattedDate} 
                            tripCreator={tripData.tripCreator}
                        />
                    </IonTitle>
                </IonHeader>
            ) : ''}
            { tripData ? (
                
                <IonContent>
                    <TripMapDisplay tripStops={tripData.tripStops}/>
                    <div className="grid-contents">
                        <IonTitle class="ion-text-center">Πληροφορίες ταξιδιού</IonTitle>
                        <IonGrid>    
                            <IonRow>
                                <IonCol size="6" className="custom-col">
                                    <div className="passenger-time-info">
                                        <IonItem lines="none" >
                                            <IonIcon icon={timeOutline} slot="start" className="time-icon" />
                                            <IonLabel>{formatDateTime(tripData.startingTime).formattedTime}</IonLabel>
                                        </IonItem>
                                        <IonItem lines="none">
                                            <IonIcon icon={peopleOutline} slot="start" className="people-icon" />
                                            <IonLabel>{tripData.noOfPassengers + ' συνεπιβάτες'} </IonLabel>
                                        </IonItem>
                                        <div className="passengers-details">
                                            <PassengersDetails passengers={tripData.tripPassengers}/>
                                        </div>
                                    </div>
                                </IonCol>
                                <IonCol size="6" className="custom-col">
                                    <IonItem lines="none">
                                        <h2>Προορισμός</h2>
                                        <p>Πρυτανεία</p>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>
                </IonContent>
            
            ): ''}
        </IonPage>
    )
}