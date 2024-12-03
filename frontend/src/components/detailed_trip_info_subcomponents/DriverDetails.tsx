import { IonAvatar, IonIcon, IonItem, IonLabel } from "@ionic/react";
import { carOutline } from "ionicons/icons";
import React from "react";
import { arrayBufferTo64String, StarRating } from "../../util/common_functions";
import { Driver } from "../../interfacesAndTypes/Types";

interface DriverDetailsProps {
    driver: Driver;

}

export const DriverDetails: React.FC<DriverDetailsProps> = ({driver}) => {
    return (
        <div className="driver-details">
            <IonItem lines="none">
              <IonIcon icon={carOutline} slot="start" className="car-icon" />
              <IonLabel>Driver</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonAvatar style={{ marginRight: '1rem', width: "50%" , maxWidth: '3.5rem'}}>
                <img
                  src={driver.user.profilePicture ? arrayBufferTo64String(driver.user.profilePicture) : "https://ionicframework.com/docs/img/demos/avatar.svg"}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </IonAvatar>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <IonLabel>{driver.user.firstName + ' ' + driver.user.lastName}</IonLabel>
                <StarRating rating={Number(driver?.user.overallRating)} />
              </div>
            </IonItem>
        </div>
    )
}