import React from "react";
import { Trip } from "../../interfacesAndTypes/Types";
import { IonItem, IonList, IonText, IonTitle } from "@ionic/react";
import './TripsDisplay.scss';
import { formatDateTime} from "../../util/common_functions";

interface TripsDisplayProps{
    tripsCompleted: Trip[];
}

export const TripsDisplay: React.FC<TripsDisplayProps> = ({tripsCompleted}) => {
    
    return (
        <div className="trip-display-container">
            <IonTitle>Completed Trips</IonTitle>
            <div className="trips-list">
                <IonList >
                    {tripsCompleted.map((trip, index) => {
                        
                        return (
                            <IonItem lines='none' key={`${trip.tripId}-${index}`} className="trip-container" color='primary'>
                                <div className="item-contents">
                                    <IonText>
                                        {
                                            'From ' + trip.startLocation.stopLocation + ' to ' + trip.endLocation.stopLocation + ' on ' + formatDateTime(trip.startingTime).formattedDate +
                                            ' with ' + trip.noOfPassengers + ' passengers.'
                                        } <br />
                                        {/* Driver: {trip.driver? (trip.driver.user.firstName + ' ' + trip.driver.user.lastName):('No driver yet')} */}
                                    </IonText>
                                </div>
                            </IonItem>
                        )
                    })}
                </IonList>
            </div>
        </div>
    );
}