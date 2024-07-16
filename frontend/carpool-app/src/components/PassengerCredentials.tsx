import { IonInput, IonLabel } from "@ionic/react";
import React from "react";

interface PassengerCredentialsProps {
    index: number;
    setPassengerCredentials: (firstName: string, lastName: string) => void;
}

export const PassengerCredentials: React.FC<PassengerCredentialsProps> = ({index, setPassengerCredentials}) => {

    let firstName: string;
    let lastName: string;

    return (
        <div className="credentials-container">
            <IonLabel style={{textAlign: 'center'}} >Additional Passenger {index + 1}</IonLabel>
            <IonInput class="ion-no-padding" type="text" placeholder="First Name" aria-label="First Name" onIonChange={(e) => {
                if(e.detail.value != undefined){
                    console.log(e.detail.value);
                    firstName = e.detail.value;
                    }
                }} ></IonInput>
            <IonInput class="ion-no-padding" type="text" placeholder="Last Name" aria-label="Last Name" onIonChange={(e) => {
                if(e.detail.value != undefined){
                    console.log(e.detail.value);
                    lastName = e.detail.value;
                    setPassengerCredentials(firstName, lastName);
                    }
                }}></IonInput>
        </div>
    );
};
