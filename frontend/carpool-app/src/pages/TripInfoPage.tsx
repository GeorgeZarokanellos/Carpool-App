import { IonPage } from "@ionic/react";
import React, { useEffect } from "react";
import { DetailedTripInformation } from "../components/DetailedTripInformation";
import { useHistory, useLocation, useParams } from "react-router";

export const TripInfoPage: React.FC = () => {
    const {tripId} = useParams<{tripId: string}>();

    return (
        <IonPage>
            <DetailedTripInformation clickedTripId={Number(tripId)}/>
        </IonPage>
            
    )
}