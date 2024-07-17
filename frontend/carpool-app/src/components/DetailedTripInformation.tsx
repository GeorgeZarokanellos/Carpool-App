import { IonContent, IonTitle } from "@ionic/react";
import React from "react";
import { Trip } from "../interfacesAndTypes/Types";

interface detailedTripInfoProps {
    tripClicked: Trip;
}

export const DetailedTripInformation: React.FC<detailedTripInfoProps> = ({ tripClicked }) => {
    return (
        <IonContent>
            {/* <IonTitle>{tripClicked.}</IonTitle> */}
        </IonContent>
    )
}