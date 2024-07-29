import { IonAlert, IonAvatar, IonButton, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonPage, IonRow, IonTitle } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { ExtendedTrip, Stop, Trip, TripStops } from "../interfacesAndTypes/Types";
import { formatDateTime } from "../util/common_functions";
import instance from "../AxiosConfig";
import { TripMapDisplay } from "./TripMapDisplay";
import './DetailedTripInformation.scss';
import { PassengersDetails } from "./PassengersDetails";
import { arrayBufferTo64String, StarRating } from "../util/common_functions";
import { UserSelectStopModal } from "./UserSelectStopModal";
import { calendarOutline, carOutline, peopleOutline, timeOutline } from "ionicons/icons";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HailIcon from '@mui/icons-material/Hail';
import { useHistory } from "react-router";


interface detailedTripInfoProps {
    clickedTripId: number;
}

export const DetailedTripInformation: React.FC<detailedTripInfoProps> = ({ clickedTripId }) => {

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight
    const [tripData, setTripData] = useState<ExtendedTrip>();
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [availableStops, setAvailableStops] = useState<Stop[]>([]);
    const [selectedStop, setSelectedStop] = useState<Stop>();
    const [userIsInTrip, setUserIsInTrip] = useState(false);
    // const [hasSubmittedRequest, setHasSubmittedRequest] = useState(false);
    const userId = localStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const history = useHistory();

    useEffect(() => {
        instance.get(`/trips/${clickedTripId}`)
        .then(response => {
            // console.log(response.data.tripStops);
            setTripData(response.data);
            // console.log('tripData', tripData);
            
        })
        .catch(error => {
            console.log(error);
        })
    }, [clickedTripId]);

    useEffect(() => {
        if(tripData){
            instance.get(`/stops`)
            .then(response => {
                setAvailableStops(response.data);
            })
            .catch(error => {
                console.log(error);
            })
        }
    }, [tripData]);

    useEffect(() => {
        if(selectedStop){
            handleRequestForJoiningTrip();
        } 
    }, [selectedStop]);

    const checkAvailability = () => {
        if(tripData && tripData.driver !== null){
            return tripData.noOfPassengers + 1 < tripData.driver.vehicle.noOfSeats ? 'Αιτηση για συμμετοχη' : 'Οχημα πληρες';
        } else if (tripData && tripData.driver === null){
            return tripData.noOfPassengers < 4 ? 'Αιτηση για συμμετοχη' : 'Αναμενεται οδηγος';
        } 
        
    }

    const checkIfUserIsInTrip = () => {
        if(tripData && tripData.tripPassengers){
            tripData.tripPassengers.forEach((passenger) => {
                if(passenger.passengerId === userIdNumber){
                    setUserIsInTrip(true);
                }
            })
        }
        if(tripData && tripData.driverId === userIdNumber){
            setUserIsInTrip(true);
        }
    }

    const handleRequestForJoiningTrip = () => {
        console.log('tripData from handle join', tripData);
        console.log('selectedStop from handle join', selectedStop);
        checkIfUserIsInTrip();
        
        if(tripData && tripData.driver && selectedStop){
            let driverMessage: string = 'Ο χρήστης ' +  + ' ζητά να συμμετάσχει στο ταξίδι σας ';

                tripData.tripStops.forEach((stop) => {
                    if(stop.stopId === selectedStop.stopId){
                        driverMessage += 'από την στάση ' + stop.details.stopLocation;
                    } else {
                        driverMessage += 'από την νέα στάση ' + stop.details.stopLocation;
                    }
                });
            if(!userIsInTrip){ 
                instance.post('/notifications', {
                    driverId: tripData.driverId,
                    passengerId: Number(userId),
                    tripId: tripData.tripId,    
                    message: driverMessage,
                    stopId: selectedStop.stopId
                });
                // setHasSubmittedRequest(true);
                setShowAlert(true);
            }
        } else {
            console.log('There is no driver or selected stop from handleRequestForJoiningTrip');
        }
    }

    useEffect(() => {
        console.log('tripData', tripData);
    }, [tripData]);

    useEffect(() => {
        console.log('selectedStop', selectedStop);
    }, [selectedStop]);
        

    return (
        <IonPage style={{height: `${viewportHeight}`, width: `${viewportWidth}`}}>
        { tripData && (
                <IonContent>
                    <TripMapDisplay tripStops={tripData.tripStops}/>
                    <IonTitle class="ion-text-center">Πληροφορίες ταξιδιού</IonTitle>
                    <div className="grid-contents">
                        <IonGrid>    
                            <IonRow>
                                <IonCol size="7" className="custom-col">
                                    <div className="passenger-time-info">
                                        <IonItem lines="none" >
                                            <IonIcon icon={timeOutline} slot="start" className="time-icon" />
                                            <IonLabel>{formatDateTime(tripData.startingTime).formattedTime}</IonLabel>
                                            <IonIcon icon={calendarOutline} className="calendar-icon" style={{marginRight: '0.5rem'}} />
                                            <IonLabel>{formatDateTime(tripData.startingTime).formattedDate}</IonLabel>
                                        </IonItem>
                                        <IonItem lines="none">
                                            <IonIcon icon={peopleOutline} slot="start" className="people-icon" />
                                            <IonLabel>{(tripData.driver? tripData.noOfPassengers + 1 + '/' + tripData.driver?.vehicle.noOfSeats : tripData.noOfPassengers) + ' συνεπιβάτες'} </IonLabel>
                                        </IonItem>
                                        <div className="passengers-details">
                                            <PassengersDetails passengers={tripData.tripPassengers}/>
                                        </div>
                                        <div className="driver-details">
                                            <IonItem lines="none" >
                                                <IonIcon icon={carOutline} slot="start" className="car-icon" />
                                                <IonLabel>Οδηγός</IonLabel>
                                            </IonItem>
                                            <IonItem lines="none">
                                                <IonAvatar style={{marginRight: '1rem', width: "50%"}}>
                                                    <img  
                                                        src={tripData.driver? arrayBufferTo64String(tripData.driver.user.profilePicture) : "https://ionicframework.com/docs/img/demos/avatar.svg" }
                                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                    />
                                                </IonAvatar>
                                                <div style={{display: "flex", flexDirection: "column"}}>
                                                    <IonLabel>{tripData.driver?.user.firstName + ' ' + tripData.driver?.user.lastName}</IonLabel>
                                                    <StarRating rating={Number(tripData.driver?.user.overallRating) } />
                                                </div>
                                            </IonItem>
                                        </div>
                                    </div>
                                </IonCol>
                                <IonCol size="5" className="custom-col">
                                    <div className="stops-display" style={{ overflowY: 'auto', maxHeight: '100%' }}>
                                        <div className="stop">
                                            <LocationOnIcon />
                                            {tripData.startLocation}
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="80px" viewBox="6 6 20 20">
                                            <g transform="scale(1.4)">{/* used to scale only the arrow and not the rectangle around it */}
                                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8 18l4 4m0 0l4-4m-4 4V2"/>
                                            </g>
                                        </svg>
                                        {tripData.tripStops.map((stop, index) => {
                                            return (
                                                <>
                                                    <div key={index} className="stop">
                                                        <HailIcon />
                                                        {stop.details.stopLocation}
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="80px" viewBox="6 6 20 20">
                                                        <g transform="scale(1.4)">{/* used to scale only the arrow and not the rectangle around it */}
                                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8 18l4 4m0 0l4-4m-4 4V2"/>
                                                        </g>
                                                    </svg>
                                                </>
                                            );
                                        })}
                                        Πρυτανεία
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>
                </IonContent>
            
        )}
            <div className="join-leave-buttons">
                <IonButton shape="round" onClick={() => {setShowModal(true)}} >
                    {checkAvailability()}
                </IonButton>
                <UserSelectStopModal 
                    isOpen={showModal} 
                    onClose={() => setShowModal(false)} 
                    availableStops={availableStops} 
                    onSelectStop={(stop) => {
                        setSelectedStop(stop);
                        setShowModal(false);
                    }} 
                />
                <IonAlert 
                    isOpen={showAlert}
                    onDidDismiss={() => {
                        setShowAlert(false)
                        history.push('./');
                    }} 
                    message={'Η αίτηση σας στάλθηκε επιτυχώς!'}    
                    buttons={['OK']}
                    animated={true}
                />
            </div>
        </IonPage>
    )
}