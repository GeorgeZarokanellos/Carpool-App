import { IonContent, IonHeader, IonItem, IonPage, IonTitle } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { ExtendedTrip, Stop, Trip } from "../interfacesAndTypes/Types";
import { TripTitle } from "./TripTitle";
import { formatDateTime } from "../util/common_functions";
import instance from "../AxiosConfig";
import { TripMapDisplay } from "./TripMapDisplay";


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
                    <IonItem lines="none">
                        <div></div>
                    </IonItem>
                </IonContent>
            
            ): ''}
        </IonPage>
    )
}