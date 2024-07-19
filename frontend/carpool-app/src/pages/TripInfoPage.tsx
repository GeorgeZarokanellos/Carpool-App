import { IonPage } from "@ionic/react";
import React from "react";
import { DetailedTripInformation } from "../components/DetailedTripInformation";
import { useLocation } from "react-router";

export const TripInfoPage: React.FC = () => {
    const {state} = useLocation();
    console.log(state);
    const {tripId} = state as {tripId: number};

    return (
        <IonPage>
            <DetailedTripInformation clickedTripId={tripId}/>
        </IonPage>
            
    )
}