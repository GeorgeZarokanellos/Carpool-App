import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { calendarOutline, peopleOutline, timeOutline } from "ionicons/icons";
import React from "react";
import { formatDateTime } from "../../util/common_functions";
import { Driver } from "../../interfacesAndTypes/Types";

interface TripDetailsProps {
    startingTime: string;
    driver: Driver;
    noOfPassengers: number;
}

export const TripDetails: React.FC<TripDetailsProps> = ({startingTime, driver, noOfPassengers}) => {
    return (
        <div className="time-calendar-people">
            <IonItem lines="none">
              <IonIcon icon={timeOutline} slot="start" className="time-icon" />
              <IonLabel>{formatDateTime(startingTime).formattedTime}</IonLabel>
              <IonIcon icon={calendarOutline} className="calendar-icon" style={{ marginRight: '0.5rem' }} />
              <IonLabel>{formatDateTime(startingTime).formattedDate}</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonIcon icon={peopleOutline} slot="start" className="people-icon" />
              <IonLabel>
                {(driver ? noOfPassengers + 1 + '/' + driver?.vehicle.noOfSeats : noOfPassengers) + ' passengers'}
              </IonLabel>
            </IonItem>
        </div>
    )
}