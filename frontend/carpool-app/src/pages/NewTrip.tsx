import { IonAlert, IonButton, IonContent, IonFooter, IonHeader, IonInput, IonPage, IonPicker } from "@ionic/react";
import React, { useEffect, useState } from "react";
import instance from "../AxiosConfig";
import { Stop } from "../interfacesAndTypes/Types";
import { text } from "ionicons/icons";

export const NewTrip: React.FC = () => {
    const role: string | null = localStorage.getItem('role');
    const userIdString = localStorage.getItem('userId');
    const [showAlert] = useState(role === 'driver');
    const [startingLocations, setStartingLocations] = useState<Stop[]>([]);
    const [tripDriverId, setTripDriverId] = useState<number | null>(null);
    const [showStartingLocationPicker, setShowStartingLocationPicker] = useState(false);
    let userIdInt: number;
    if(userIdString)
        userIdInt = parseInt(userIdString, 10);
    // console.log(localStorage);

    // instance.post('/trip', {

    // })

    useEffect(() => {
        instance.get('/trips/starting-locations')
        .then(response => {
            console.log("Starting locations: ", response.data);
            setStartingLocations(response.data);
        })
    },[])
    
    return (
        <div>
            <IonPage>
                <IonHeader>
                    Create a new trip
                </IonHeader>
                <IonContent>
                    <IonAlert 
                        isOpen={showAlert} 
                        header="Are you gonna be the driver or not?"
                        buttons={[{
                                text: 'yes',
                                role: 'confirm',
                                handler: () => {
                                    setTripDriverId(userIdInt);
                                }
                            },
                            {
                                text: 'no',
                                role: 'cancel',
                                handler: () => {
                                    console.log("The user is a passenger");
                                }
                            }
                        ]}
                    />
                    <div className="new-trip-input-container">
                        <form className="trip-form">
                            <div className="form-contents">
                                <IonButton onClick={() => setShowStartingLocationPicker(true)}/>
                                <IonPicker 
                                    isOpen={showStartingLocationPicker}
                                    columns={[
                                        {
                                            name: 'Starting Locations',
                                            options: startingLocations.map((stop, index) => ({
                                                text: stop.stopLocation,
                                                value: index
                                            }))
                                        }
                                    ]}    
                                />
                            </div>
                        </form>
                    </div>
                </IonContent>
                <IonFooter>

                </IonFooter>
            </IonPage>
        </div>
    );
}