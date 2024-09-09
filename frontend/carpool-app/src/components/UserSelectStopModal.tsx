import React from "react";
import { Stop } from "../interfacesAndTypes/Types";
import { IonButton, IonContent, IonItem, IonList, IonModal} from "@ionic/react";


interface UserSelectStopModalProps {
    isOpen: boolean;
    onClose: () => void;
    endLocationId: number;
    availableStops: Stop[];
    onSelectStop: (stopId: Stop) => void;        
}

export const UserSelectStopModal:React.FC<UserSelectStopModalProps> = ({isOpen, onClose, endLocationId, availableStops, onSelectStop}) => {

    return (
        <IonModal isOpen={isOpen}>
            <IonContent>
                <div style={{width: '100%', textAlign: 'center', display:'flex', justifyContent: 'center'}}>
                    <h3 style={{width: '80%'}}>
                        Choose from which stop you want to be picked up
                    </h3>
                </div>
                <IonList>
                    {
                        availableStops.map((stop,index) => {
                            if(stop.stopId !== endLocationId){ //exclude the end location from the list of stops
                                return(
                                    <IonItem lines="full" button key={index} onClick={() => onSelectStop(stop)}>
                                        <div style={{width: '100%', textAlign: 'center'}}>
                                            {stop.stopLocation}
                                        </div>
                                    </IonItem>
                                )
                            }
                        })
                    }
                </IonList>
                <IonButton onClick={onClose} expand="block" color="danger">
                    Close
                </IonButton>
            </IonContent>
        </IonModal>
    )
}