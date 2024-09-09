import { IonPage } from "@ionic/react";
import React from "react";
import { useParams } from "react-router";
import { DetailedTripInformation } from "../components/DetailedTripInformation";

export const DetailedTripInformationPage: React.FC = () => {
    
    const {tripId} = useParams<{tripId: string}>();
    const tripIdNumber = Number(tripId);
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    return (
        <IonPage style={{ height: `${viewportHeight}`, width: `${viewportWidth}` }}>
            <DetailedTripInformation clickedTripId={tripIdNumber} page="detailedInfo"/>
        </IonPage>
    )
}