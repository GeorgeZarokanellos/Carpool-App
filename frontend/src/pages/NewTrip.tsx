import { IonAlert, IonButton, IonContent, IonDatetime, IonHeader, IonItem, IonPage, IonPicker, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react";
import instance from "../AxiosConfig";
import { Stop } from "../interfacesAndTypes/Types";
import './NewTrip.scss';
import { useHistory } from "react-router";
import { PassengerCredentials } from "../components/PassengerCredentials";
import { tripStatus } from "../interfacesAndTypes/Types";

//TODO nextScheduledTripId 

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
    //local storage
    const userIdString = localStorage.getItem('userId');
    const userIdInt = parseInt(userIdString as string, 10);
    //driver info
    const [currentTripId, setCurrentTripId] = useState<number | null>(null);
    const [nextScheduledTripId, setNextScheduledTripId] = useState<number | null>(null);
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
    //alert
    const [showTripCompletedAlert, setShowTripCompletedAlert] = useState(false);
    const [tripCompletionMessage, setTripCompletionMessage] = useState<string>('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const retrieveDriverInfo = async () => {
        try {
            const response = await instance.get(`/user/${userIdInt}`);
            setCurrentTripId(response.data.currentTripId);
            setNextScheduledTripId(response.data.nextScheduledTripId);
        } catch (error) {
            console.log("Error retrieving driver info", error);
        }
    }

    const retrieveStartingLocations = async () => {
        try {
            const response = await instance.get('/trips/start-locations')
            setStartLocations(response.data);
        } catch (error) {
            console.log('Error retrieving start locations');
        }
    }

    const compareDates = (tripDateToBeCompared: Date, tripDateToBeCreated: Date) => {
        const differenceInMilliseconds = tripDateToBeCreated.getTime() - tripDateToBeCompared.getTime();
        const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
        if( differenceInMilliseconds >= twoHoursInMilliseconds)
            return true
        else 
            return false
    }

    const startingHourOfNewTripIsValid = async () => {
        if(currentTripId === null && nextScheduledTripId === null){
            //if driver has no trips every hour is valid
            return {isValid: true};
        } else if (currentTripId !== null && nextScheduledTripId === null){
            //if driver has current trip next trip should be at least 2 hours after current's trip starting time
            try {
                const currentTripInfo = await instance.get(`/trips/info/${currentTripId}`);
                const tripDateToBeCompared = new Date(currentTripInfo.data.startingTime);
                return {
                    isValid: compareDates( tripDateToBeCompared, selectedDate),
                    previousTripStartingTime: tripDateToBeCompared
                }
            } catch (error) {
                console.log("Error retrieving current trip id info");
            }

        } else if(currentTripId !== null && nextScheduledTripId !== null){
            //if driver has both current and next scheduled search for other trips 
            try {
                const userTrips = await instance.get(`/user/trips/${userIdInt}?currentTripId=${currentTripId}&nextScheduledTripId=${nextScheduledTripId}`)
                console.log("User Trips", userTrips);
                
                if(userTrips.data.length === 0){
                    //if no other trips exist next trip should be at least 2 hours after next scheduled trip's starting time
                    const nextScheduledTripInfo = await instance.get(`/trips/info/${nextScheduledTripId}`);
                    const tripDateToBeCompared = new Date(nextScheduledTripInfo.data.startingTime);
                    return {
                        isValid: compareDates(tripDateToBeCompared, selectedDate),
                        previousTripStartingTime: tripDateToBeCompared
                    }; 
                } else {
                    //if other trips exist the next trip should be at least 2 hours after the last trip of the user
                    const length = userTrips.data.length;
                    console.log("Last trip", userTrips.data[length - 1]);
                    
                    const tripDateToBeCompared = new Date(userTrips.data[length - 1].startingTime);
                    return {
                        isValid: compareDates(tripDateToBeCompared,selectedDate),
                        previousTripStartingTime: tripDateToBeCompared
                    };
                }
            } catch (error) {
                console.log("Error retrieving next scheduled trip info or user trips");
                
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log("Check conditions: ", selectedStartLocation, selectedEndLocation, selectedDate, selectedPassengerNumber);
            const newHourIsValid = await startingHourOfNewTripIsValid();
            if(newHourIsValid === undefined){
                console.log("New hour is valid is undefined");
            } else {
                if(!newHourIsValid.isValid){
                    setErrorMessage(`The date and hour you have selected intersects with the starting time and duration of a previous trip(start's at ${newHourIsValid.previousTripStartingTime}).` + 
                        ' Please create a trip that\'s at least 2 hours after the previous one!'
                    );
                    setShowErrorAlert(true);
                } else {
                    if(selectedStartLocation !== null && selectedEndLocation !== null && selectedDate !== null ){
                        if(selectedPassengerNumber < 3){
                            requestBody = {
                                tripCreatorId: userIdInt,
                                driverId: tripDriverId,
                                startLocationId: selectedStartLocation.stopId,
                                endLocationId: selectedEndLocation.stopId,
                                startingTime: selectedDate.toISOString(),
                                stops: [],
                                passengers: passengerCredentials
                            }
                        } else if (selectedPassengerNumber === 3) {
                            requestBody = {
                                tripCreatorId: userIdInt,
                                driverId: tripDriverId,
                                startLocationId: selectedStartLocation.stopId,
                                endLocationId: selectedEndLocation.stopId,
                                startingTime: selectedDate.toISOString(),
                                stops: [],
                                passengers: passengerCredentials,
                                status: tripStatus.LOCKED
                            }
                        }
            
                        const response = await instance.post('/trips', requestBody);
                        if(response){
                            console.log(response.data);
                            const newTripId = response.data.tripId;
                            console.log("Current trip id: ", currentTripId);
                            console.log("Next scheduled trip id: ", nextScheduledTripId);
                            
                            if(currentTripId === null){
                                //update the current trip of the user to the newly created one
                                await instance.patch(`/user/${userIdInt}`, {
                                    currentTripId: newTripId
                                }).
                                then((response) => {
                                    console.log(response.data);
                                })
                                .catch((error) => {
                                    console.log("Failed to update current trip id of driver ",error);
                                });
                            } else if(nextScheduledTripId === null){
                                //update the next scheduled trip of the driver to the newly created one if he has a current one already
                                await instance.patch(`/driver/${userIdInt}`, {
                                    nextScheduledTripId: newTripId
                                })
                                .then((response) => {
                                    console.log(response.data);
                                })
                                .catch((error) => {
                                    console.log("Failed to update nextScheduledTripId of driver ",error);
                                });
                            }
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
                }
            }
            

        } catch (error) {
            console.log("Error creating trip or updating user", error);
        }

    }

    const updatePassengerCredentials = (firstName: string, lastName: string) => {
        setPassengerCredentials([...passengerCredentials, {firstName: firstName, lastName: lastName}]);
    }

    useEffect(() => {
        retrieveStartingLocations();
    },[]);
    
    useEffect(() => {
        setTripDriverId(userIdInt);
    }, [userIdInt]);

    useEffect(() => {
        if(userIdInt){
            retrieveDriverInfo();
        }
    },[userIdInt]);

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