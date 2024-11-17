import { IonAlert, IonButton } from "@ionic/react";
import React from "react";
import { UserSelectStopModal } from "../UserSelectStopModal";
import { Stop } from "../../interfacesAndTypes/Types";

interface JoinButtonProps {
    userIsInTrip: boolean;
    availabilityMessage: string;
    stopSelectModal: boolean;
    endLocationId: number;
    availableStops: Stop[];
    joinRequestSentAlert: boolean;
    userRequestedToJoinInTrip: boolean;
    startingFromUniversity: boolean;
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
    userRequestedToJoinInTrip,
    startingFromUniversity,
    setStopSelectModal,
    setSelectedStop,
    setJoinRequestSentAlert,
}) => {
    
   return (
    <div className="join-button">
        <IonButton disabled={userIsInTrip || userRequestedToJoinInTrip} shape="round" color="secondary"  onClick={() => { setStopSelectModal(true) }}>
            {availabilityMessage}
        </IonButton>
        <UserSelectStopModal
            isOpen={stopSelectModal}
            onClose={() => setStopSelectModal(false)}
            endLocationId={endLocationId}
            availableStops={availableStops}
            startingFromUniversity={startingFromUniversity}
            onSelectStop={(stop) => {
                setSelectedStop(stop);
                setStopSelectModal(false);
            }}
        />
        <IonAlert
            isOpen={joinRequestSentAlert}
            onDidDismiss={() => {
            setJoinRequestSentAlert(false);
            window.location.reload();
            }}
            message={'Your request has been sent to the driver!'}
            buttons={['OK']}
            animated={true}
        />
    </div>
   ) 
};