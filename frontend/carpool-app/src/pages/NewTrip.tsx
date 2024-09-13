import { IonAlert, IonButton, IonContent, IonDatetime, IonHeader, IonItem, IonPage, IonPicker, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react";
import instance from "../AxiosConfig";
import { Stop } from "../interfacesAndTypes/Types";
import './NewTrip.scss';
import { useHistory } from "react-router";
import { PassengerCredentials } from "../components/PassengerCredentials";
import { tripStatus } from "../interfacesAndTypes/Types";

interface requestBody {
    tripCreatorId: number,
    driverId: number | null,
    startLocationId: number,
    endLocationId: number,
    startingTime: string,
    stops: Stop[],
    passengers: {firstName: string, lastName: string}[]
    status?: tripStatus
}

export const NewTrip: React.FC = () => {
    const history = useHistory();
    let requestBody: requestBody;
    //screen dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const userIdString = localStorage.getItem('userId');
    const userIdInt = parseInt(userIdString as string, 10);

    const [startLocations, setStartLocations] = useState<Stop[]>([]);
    const [tripDriverId, setTripDriverId] = useState<number | null>(null);
    //start end location picker
    const [showStartLocationPicker, setShowStartLocationPicker] = useState(false);
    const [startLocationPickerKey, setStartLocationPickerKey] = useState<number>(0);
    const [showEndLocationPicker, setShowEndLocationPicker] = useState(false);
    const [selectedStartLocation, setSelectedStartLocation] = useState<{loc: string, stopId: number} | null>(null);
    const [selectedEndLocation, setSelectedEndLocation] = useState<{loc: string, stopId: number} | null>(null);
    //passenger number picker
    const [showPassengerNumberPicker ,setShowPassengerNumberPicker] = useState(false);
    const [passengerNumberPickerKey, setPassengerNumberPickerKey] = useState<number>(10);
    const [selectedPassengerNumber, setSelectedPassengerNumber] = useState<number>(0);
    const [passengerCredentialsInputsKey, setPassengerCredentialsInputsKey] = useState<number>(20);
    //passenger credentials
    //TODO reset the passenger credentials when the user deletes a passenger
    const [passengerCredentials, setPassengerCredentials] = useState<{firstName: string, lastName: string}[]>([]);
    //hour picker
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    //additional stops
    const [stops, setStops] = useState<Stop[]>([]);
    //alert
    const [showTripCompletedAlert, setShowTripCompletedAlert] = useState(false);
    const [tripCompletionMessage, setTripCompletionMessage] = useState<string>('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log("Check conditions: ", selectedStartLocation, selectedEndLocation, selectedDate, selectedPassengerNumber);
            
            if(selectedStartLocation !== null && selectedEndLocation !== null && selectedDate !== null ){
                if(selectedPassengerNumber < 3){
                    requestBody = {
                        tripCreatorId: userIdInt,
                        driverId: tripDriverId,
                        startLocationId: selectedStartLocation.stopId,
                        endLocationId: selectedEndLocation.stopId,
                        startingTime: selectedDate.toISOString(),
                        stops: stops,
                        passengers: passengerCredentials
                    }
                } else if (selectedPassengerNumber === 3) {
                    requestBody = {
                        tripCreatorId: userIdInt,
                        driverId: tripDriverId,
                        startLocationId: selectedStartLocation.stopId,
                        endLocationId: selectedEndLocation.stopId,
                        startingTime: selectedDate.toISOString(),
                        stops: stops,
                        passengers: passengerCredentials,
                        status: tripStatus.LOCKED
                    }
                }
    
                const response = await instance.post('/trips', requestBody);
                if(response){
                    console.log(response.data);
                    const newTripId = response.data.tripId;
    
                    //update the current trip of the user to the newly created one
                    await instance.put(`/user/${userIdInt}`, {
                        currentTripId: newTripId
                    }).
                    then((response) => {
                        console.log(response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                    setTripCompletionMessage("Trip created successfully");
                    setShowTripCompletedAlert(true);
    
                } else {
                    console.log("Trip creation failed");
                    setPassengerCredentials([]);
                    setErrorMessage("Trip creation failed. Check the fields and try again");
                    setShowErrorAlert(true);
                }
            } else {
                setErrorMessage("Please fill in all the fields");
                setShowErrorAlert(true);
            }

        } catch (error) {
            console.log("Error creating trip or updating user", error);
            
        }

    }
    
    const updatePassengerCredentials = (firstName: string, lastName: string) => {
        setPassengerCredentials([...passengerCredentials, {firstName: firstName, lastName: lastName}]);
    }

    useEffect(() => {
        instance.get('/trips/start-locations')
        .then(response => {
            console.log("Start locations: ", response.data);
            setStartLocations(response.data);
        })
    },[]);

    useEffect(() => {
        console.log("Request Body: ", requestBody);
    }, [passengerCredentials]);
    
    useEffect(() => {
        setTripDriverId(userIdInt);
    }, [userIdInt]);

    return (
        <div>
            <IonPage style={{width: `${viewportWidth}`, height: `${viewportHeight}`}}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle style={{ textAlign: "center" }}>
                            Trip Creation
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <div className="new-trip-input-container">
                        <form className="trip-form" onSubmit={handleSubmit}>
                            <div className="form-contents">
                                <IonButton onClick={() => {
                                    setShowStartLocationPicker(true);
                                    setStartLocationPickerKey(prevKey => prevKey + 1);
                                    }} > 
                                    {
                                        selectedStartLocation && selectedEndLocation ? (
                                            <p style={{margin: 0, wordWrap: 'break-word', whiteSpace: 'normal'}}>
                                                Starting at
                                                {' ' + selectedStartLocation.loc}
                                                <br />
                                                <br />
                                                Ending at
                                                {' ' + selectedEndLocation.loc}
                                            </p>
                                        ) : "Select start and end location"
                                    }
                                </ IonButton>
                                <IonPicker 
                                    isOpen={showStartLocationPicker}
                                    key={startLocationPickerKey}
                                    columns={[
                                        {
                                            name: 'Start Locations',
                                            options: startLocations.map((stop) => ({
                                                text: stop.stopLocation,
                                                value: stop.stopId
                                            }))
                                        }
                                    ]}  
                                    buttons={[
                                        {
                                            text: "Cancel",
                                            role: "Cancel",
                                            handler: () => setShowStartLocationPicker(false),
                                        },
                                        {
                                            text: "Confirm",
                                            role: "Confirm",
                                            handler: (value) => {
                                                console.log("Selected stop:", value['Start Locations'].value);
                                                
                                                setSelectedStartLocation({loc: value['Start Locations'].text, stopId: value['Start Locations'].value});
                                                if(value['Start Locations'].text !== 'Prytaneia'){
                                                    const prytaneia = startLocations.find(stop => stop.stopLocation === 'Prytaneia');
                                                    if(prytaneia){
                                                        setSelectedEndLocation({loc: prytaneia.stopLocation, stopId: prytaneia.stopId});
                                                    } else {
                                                        console.log("Prytaneia not found");
                                                    }
                                                    setShowStartLocationPicker(false);
                                                } else {
                                                    setShowStartLocationPicker(false);
                                                    setShowEndLocationPicker(true);
                                                }
                                            }
                                        }
                                    ]}  
                                />
                                <IonPicker 
                                    isOpen={showEndLocationPicker}
                                    columns={[
                                        {
                                            name: 'End Locations',
                                            options: startLocations
                                                .filter(stop => stop.stopLocation !== 'Prytaneia')
                                                .map((stop) => ({
                                                    text: stop.stopLocation,
                                                    value: stop.stopId
                                                }))
                                        }
                                    ]}
                                    buttons={[
                                        {
                                            text: "Cancel", 
                                            role: "Cancel", 
                                            handler: () => {
                                                setShowEndLocationPicker(false)
                                                setShowStartLocationPicker(true);
                                            }
                                        },
                                        {
                                            text: "Confirm",
                                            role: "Confirm",
                                            handler: (value) => {
                                                console.log("Selected stop:", value['End Locations'].value);
                                                
                                                setSelectedEndLocation({loc: value['End Locations'].text, stopId: value['End Locations'].value});
                                                setShowEndLocationPicker(false);
                                            }
                                        }
                                    ]}
                                />
                                <IonButton onClick={() => {
                                    setShowPassengerNumberPicker(true);
                                    setPassengerNumberPickerKey(prevKey => prevKey + 1);
                                    setPassengerCredentialsInputsKey(prevKey => prevKey + 1);
                                }}>
                                    {
                                        selectedPassengerNumber > 0 ? (
                                            <p style={{margin: 0}}>Number of passengers
                                                {' ' + selectedPassengerNumber }
                                            </p>
                                        ) : "Add passengers"
                                    }
                                </IonButton>
                                <IonPicker 
                                    isOpen={showPassengerNumberPicker}
                                    key={passengerNumberPickerKey}
                                    columns={[
                                        {
                                            name: 'Passenger Number',
                                            options: [
                                                {
                                                    text: '0',
                                                    value: 0
                                                },
                                                {
                                                    text: '1',
                                                    value: 1
                                                },
                                                {
                                                    text: '2',
                                                    value: 2
                                                },
                                                {
                                                    text: '3',
                                                    value: 3
                                                },
                                            ]
                                        }
                                    ]}
                                    buttons={[
                                        {
                                            text: "Cancel",
                                            role: "Cancel",
                                            handler: () => setShowPassengerNumberPicker(false),
                                        },
                                        {
                                            text: "Confirm",
                                            role: "Confirm",
                                            handler: (value) => {
                                                setSelectedPassengerNumber(value['Passenger Number'].value);
                                            }
                                        }
                                    ]}
                                />
                                {
                                    selectedPassengerNumber > 0 ? (
                                        <IonItem key={passengerCredentialsInputsKey}>
                                            <div className="passengers-credentials-container">
                                            {
                                                Array.from({length: selectedPassengerNumber}, (_, i) => i).map((index) => {
                                                    return(
                                                        <PassengerCredentials 
                                                            key={index} 
                                                            index={index} 
                                                            setPassengerCredentials={updatePassengerCredentials} 
                                                        />
                                                    );
                                                })
                                            }
                                            </div>
                                        </IonItem>
                                    ) : null
                                }
                                <IonButton >
                                    {
                                        selectedDate ? (
                                            <p style={{margin: 0}}>
                                                {/* {console.log(selectedDate.toString())} */}
                                                {'At ' + selectedDate.toString().split(' ').slice(0, 4).join(' ') + ' on ' + selectedDate.toString().split(' ')[4].split(':').slice(0, 2).join(':')}
                                            </p>
                                        ) : "Select date and time below"
                                    
                                    }
                                </IonButton>
                                <IonDatetime 
                                    presentation="date-time"
                                    showDefaultButtons={true}
                                    min={new Date(new Date().setHours(new Date().getHours())).toISOString()}
                                    hourCycle="h23"
                                    onIonChange={(e) => {
                                        console.log(e.detail.value);
                                        if(typeof e.detail.value === 'string'){                                                                                        
                                            setSelectedDate(new Date(e.detail.value.toString()));
                                            console.log("Selected datetime: ", selectedDate);
                                        }
                                    }}
                                >
                                </IonDatetime>
                            </div>
                            <IonButton type="submit" shape="round">
                                Submit Trip
                            </IonButton>
                        </form>
                    </div>
                </IonContent>
                <IonAlert 
                    isOpen={showTripCompletedAlert}
                    onDidDismiss={() => {
                        setShowTripCompletedAlert(false);
                        history.push('/main/search-trips');
                        window.location.reload();
                    }}
                    header={'Trip Creation'}
                    message={tripCompletionMessage}
                    buttons={['OK']}
                />
                <IonAlert 
                    isOpen={showErrorAlert}
                    onDidDismiss={() => {
                        setShowErrorAlert(false);
                    }}
                    header={'Error'}
                    message={errorMessage}
                    buttons={['OK']}
                />
            </IonPage>
        </div>
    );
}