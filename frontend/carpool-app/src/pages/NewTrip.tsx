import { IonAlert, IonButton, IonContent, IonDatetime, IonFooter, IonHeader, IonItem, IonPage, IonPicker, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react";
import instance from "../AxiosConfig";
import { Stop } from "../interfacesAndTypes/Types";
import './NewTrip.scss';
import { useHistory } from "react-router";
import { PassengerCredentials } from "../components/PassengerCredentials";

interface requestBody {
    tripCreatorId: number,
    driverId: number | null,
    startLocation: string,
    startingTime: string,
    stops: Stop[],
    passengers: {firstName: string, lastName: string}[]
}

export const NewTrip: React.FC = () => {
    const history = useHistory();
    let requestBody: requestBody;
    //screen dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const role: string | null = localStorage.getItem('role');
    const userIdString = localStorage.getItem('userId');
    const [showAlert] = useState(role === 'driver');
    const [startingLocations, setStartingLocations] = useState<Stop[]>([]);
    const [tripDriverId, setTripDriverId] = useState<number | null>(null);
    const [firstPassengerId, setFirstPassengerId] = useState<number | null>(null);
    const [firstPassengerCredentials, setFirstPassengerCredentials] = useState<{firstName: string, lastName: string} | null>(null);
    //starting location picker
    const [showStartingLocationPicker, setShowStartingLocationPicker] = useState(false);
    const [startLocationPickerKey, setStartLocationPickerKey] = useState<number>(0);
    const [selectedStartingLocation, setSelectedStartingLocation] = useState<string>('');
    //passenger number picker
    const [showPassengerNumberPicker ,setShowPassengerNumberPicker] = useState(false);
    const [passengerNumberPickerKey, setPassengerNumberPickerKey] = useState<number>(10);
    const [selectedPassengerNumber, setSelectedPassengerNumber] = useState<number>(1);
    const [passengerCredentialsInputsKey, setPassengerCredentialsInputsKey] = useState<number>(20);
    //passenger credentials
    //TODO reset the passenger credentials when the user deletes a passenger
    const [passengerCredentials, setPassengerCredentials] = useState<{firstName: string, lastName: string}[]>([]);
    //hour picker
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    //additional stops
    const [stops, setStops] = useState<Stop[]>([]);

    let userIdInt: number;
    if(userIdString){
        userIdInt = parseInt(userIdString, 10);
    }

    useEffect(() => {
        instance.get('/trips/starting-locations')
        .then(response => {
            console.log("Starting locations: ", response.data);
            setStartingLocations(response.data);
        })
    },[]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            requestBody = {
                tripCreatorId: userIdInt,
                driverId: tripDriverId,
                startLocation: selectedStartingLocation,
                startingTime: selectedDate.toISOString(),
                stops: stops,
                passengers: passengerCredentials
            }

            const response = await instance.post('/trips', requestBody);
            if(response){
                console.log(response.data);
                const newTripId = response.data.tripId;
                alert("Trip created successfully");

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

            } else {
                console.log("Trip creation failed");
                setPassengerCredentials([]);
                alert("Trip creation failed");
            }

            history.push('/main/search-trips');
        } catch (error) {
            console.log("Error creating trip or updating user", error);
            
        }

    }
    
    const updatePassengerCredentials = (firstName: string, lastName: string) => {
        setPassengerCredentials([...passengerCredentials, {firstName: firstName, lastName: lastName}]);
    }

    const retrieveCurrentUsersCredentials = async () => {
        try {
            await instance.get(`/user/${userIdInt}`)
            .then(response => {
                console.log(response.data);
                setFirstPassengerCredentials({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName
                });
            });
        } catch (error) {
            console.log("Error retrieving user's credentials", error);
        }
    }

    useEffect(() => {   //retrieve the first passenger's credentials
        if(firstPassengerId){
            retrieveCurrentUsersCredentials();
        }

    },[firstPassengerId]);

    useEffect(() => {   //add the first passenger's credentials to the passengerCredentials array
        if(firstPassengerCredentials && passengerCredentials.length === 0){
            setPassengerCredentials([firstPassengerCredentials]);
        } else if(firstPassengerCredentials){
            setPassengerCredentials([...passengerCredentials, firstPassengerCredentials]);
        }
    }, [firstPassengerCredentials]);

    useEffect(() => {
        console.log("Request Body: ", requestBody);
    }, [passengerCredentials]);

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
                                    //if the driver wants to be passenger 
                                    setFirstPassengerId(userIdInt);
                                }
                            }
                        ]}
                    />
                    <div className="new-trip-input-container">
                        <form className="trip-form" onSubmit={handleSubmit}>
                            <div className="form-contents">
                                <IonButton onClick={() => {
                                    setShowStartingLocationPicker(true);
                                    setStartLocationPickerKey(prevKey => prevKey + 1);
                                    }} > 
                                    {
                                        selectedStartingLocation ? (
                                            <p style={{margin: 0}}>Starting at
                                                {' ' + selectedStartingLocation}
                                            </p>
                                        ) : "Select starting location"
                                    }
                                </ IonButton>
                                <IonPicker 
                                    isOpen={showStartingLocationPicker}
                                    key={startLocationPickerKey}
                                    columns={[
                                        {
                                            name: 'Starting Locations',
                                            options: startingLocations.map((stop, index) => ({
                                                text: stop.stopLocation,
                                                value: index
                                            }))
                                        }
                                    ]}  
                                    buttons={[
                                        {
                                            text: "Cancel",
                                            role: "Cancel",
                                            handler: () => setShowStartingLocationPicker(false),
                                        },
                                        {
                                            text: "Confirm",
                                            role: "Confirm",
                                            handler: (value) => {
                                                // console.log(value);
                                                // console.log(value['Starting Locations'].text);
                                                setSelectedStartingLocation(value['Starting Locations'].text);
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
                                        selectedPassengerNumber ? (
                                            <p style={{margin: 0}}>Number of passengers
                                                {' ' + selectedPassengerNumber }
                                            </p>
                                        ) : "Select number of passengers"
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
                                    selectedPassengerNumber > 1 ? (
                                        <IonItem key={passengerCredentialsInputsKey}>
                                            <div className="passengers-credentials-container">
                                            {
                                                Array.from({length: selectedPassengerNumber-1}, (_, i) => i).map((index) => {
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
                                    //minimum date is the day after the current
                                    min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()}
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
                <IonFooter>

                </IonFooter>
            </IonPage>
        </div>
    );
}