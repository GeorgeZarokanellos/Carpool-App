import { IonAlert, IonButton, IonText } from "@ionic/react";
import React from "react";
import { UserSelectStopModal } from "../UserSelectStopModal";
import { Stop } from "../../interfacesAndTypes/Types";
import { useHistory } from "react-router";

interface JoinButtonProps {
    userIsInTrip: boolean;
    availabilityMessage: string;
    stopSelectModal: boolean;
    endLocationId: number;
    availableStops: Stop[];
    joinRequestSentAlert: boolean;
    setStopSelectModal: (value: boolean) => void;
    setSelectedStop: (value: Stop) => void;
    setJoinRequestSentAlert: (value: boolean) => void;
}

export const JoinButton: React.FC<JoinButtonProps> = ({
    userIsInTrip,
    availabilityMessage,
    stopSelectModal,
    endLocationId,
    availableStops,
    joinRequestSentAlert,
    setStopSelectModal,
    setSelectedStop,
    setJoinRequestSentAlert,
}) => {
    const history = useHistory();
   return (
    <div className="join-button">
        <IonButton disabled={userIsInTrip} shape="round" color="secondary"  onClick={() => { setStopSelectModal(true) }}>
            {availabilityMessage}
        </IonButton>
        <UserSelectStopModal
            isOpen={stopSelectModal}
            onClose={() => setStopSelectModal(false)}
            endLocationId={endLocationId}
            availableStops={availableStops}
            onSelectStop={(stop) => {
            setSelectedStop(stop);
            setStopSelectModal(false);
            }}
        />
        <IonAlert
            isOpen={joinRequestSentAlert}
            onDidDismiss={() => {
            setJoinRequestSentAlert(false);
            history.goBack();
            }}
            message={'Your request has been sent to the driver!'}
            buttons={['OK']}
            animated={true}
        />
    </div>
   ) 
};