import React from "react";
import { Stop } from "../interfacesAndTypes/Types";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonModal, IonText, IonTitle } from "@ionic/react";


interface UserSelectStopModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableStops: Stop[];
    onSelectStop: (stopId: number) => void;        
}

export const UserSelectStopModal:React.FC<UserSelectStopModalProps> = ({isOpen, onClose, availableStops, onSelectStop}) => {

    return (
        <IonModal isOpen={isOpen}>
            <IonContent>
                <IonLabel class="ion-text-center">
                    Επιλέξτε στάση που από όπου θέλετε να σας παραλάβει ο οδηγος
                </IonLabel>
                <IonList>
                    {
                        availableStops.map((stop,index) => (
                            <IonItem lines="full" button key={index} onClick={() => onSelectStop(stop.stopId)}>
                                {stop.stopLocation}
                            </IonItem>
                        ))
                    }
                </IonList>
            </IonContent>
        </IonModal>
    )
}