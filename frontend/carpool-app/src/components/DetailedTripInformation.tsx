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
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { useHistory } from "react-router";
import { TripInProgress } from "./TripInProgress";


interface detailedTripInfoProps {
    clickedTripId: number;
    page: string;
}

export const DetailedTripInformation: React.FC<detailedTripInfoProps> = ({ clickedTripId, page }) => {
    const [tripData, setTripData] = useState<ExtendedTrip>();

    //join request modal
    const [stopSelectModal, setStopSelectModal] = useState(false);
    const [selectedStop, setSelectedStop] = useState<Stop>();
    const [joinRequestSentAlert, setJoinRequestSentAlert] = useState(false);
    const [availableStops, setAvailableStops] = useState<Stop[]>([]);
    //notification message details
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [overallRating, setOverallRating] = useState('');
    //notification request checks
    const [userIsInTrip, setUserIsInTrip] = useState(false);
    const [requestMade, setRequestMade] = useState(false);
    //bottom section buttons and messages
    const [currentTripId, setCurrentTripId] = useState(null);
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [tripDriverCurrentUser, setTripDriverCurrentUser] = useState(false);
    const [driverWantsToEndTrip, setDriverWantsToEndTrip] = useState(false);
    const [tripEnded, setTripEnded] = useState(false); 

    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');
    const userIdNumber = Number(userId);
    const history = useHistory();
    

    useEffect(() => {
        instance.get(`/trips/${clickedTripId}`)
        .then(response => {
            console.log(response.data);
            setTripData(response.data);
            
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
            });
            checkIfUserIsInTrip();
        }
    }, [tripData]);

    useEffect(() => {
        if(selectedStop){
            handleRequestForJoiningTrip();
        } 
    }, [selectedStop]);

    useEffect(() => {
        fetchUsersFullName();
        // checkAvailability();
    }, []);

    useEffect(() => {
        checkAvailability();
    }, [userIsInTrip, tripData]);

    useEffect(() => {
      if(driverWantsToEndTrip){
        const userConfirmed = window.confirm('Είστε σίγουρος ότι θέλετε να τερματίσετε το ταξίδι;');
        if(userConfirmed){
          console.log('User wants to end trip');
          
        } else {
          setDriverWantsToEndTrip(false);
        }
      }
    }, [driverWantsToEndTrip])

    const fetchUsersFullName = async () => {
        try {
            const response = await instance.get(`/user/${userId}`);
            if(response.data){
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setOverallRating(response.data.overallRating);
                setCurrentTripId(response.data.currentTripId);
            }
        } catch (error) {
            console.log("Error fetching user's full name and rating", error);
        }
    }

    const checkAvailability = () => {
        if(tripData && page === 'detailedInfo'){
          if(tripData.driver !== null && !userIsInTrip){
              setAvailabilityMessage(tripData.noOfPassengers + 1 < tripData.driver.vehicle.noOfSeats ? 'Αιτηση για συμμετοχη' : 'Οχημα πληρες');
          } else if (tripData.driver === null && !userIsInTrip){
            if(userRole === 'passenger'){
              setAvailabilityMessage(tripData.noOfPassengers < 4 ? 'Αιτηση για συμμετοχη' : 'Αναμενεται οδηγος');
            } else {
              setAvailabilityMessage('Αίτηση για συμμετοχή ως οδηγός');
            }
          } else if (userIsInTrip){
              if(currentTripId !== null && currentTripId === tripData.tripId){
                  setAvailabilityMessage('Συμμετέχετε ηδη στο ταξιδι');
              } else {
                  setAvailabilityMessage('Συμμετέχετε ηδη σε αλλο ταξιδι');
              }
          }

        }
        
    }

    const checkIfUserIsInTrip = () => {
        //user is in trip passengers
        if(tripData && tripData.tripPassengers){
            tripData.tripPassengers.forEach((passenger) => {
                
                if(passenger.passengerId === userIdNumber){
                    setUserIsInTrip(true);
                }
            })
        }
        //user is driver
        if(tripData && tripData.driverId === userIdNumber){
            setUserIsInTrip(true);
            setTripDriverCurrentUser(true); //current user is the driver of the trip
        }
        //user is in another trip
        if(currentTripId !== null ){
            setUserIsInTrip(true);
        }
    }

    const handleRequestForJoiningTrip = () => {      
        
        if(tripData && tripData.driver && selectedStop){
            let driverMessage: string = 'Ο/H χρήστης ' + firstName + ' ' + lastName + ' με βαθμολογία ' + overallRating + ' ζητά να συμμετάσχει στο ταξίδι σας ';
            let stopExists = false;
            tripData.tripStops.forEach((stop) => {
                if(stop.stopId === selectedStop.stopId){
                    console.log('User selected stop is the same as an existing stop');
                    stopExists = true;
                }
            });

            if(stopExists){
                driverMessage += 'από την στάση ' + selectedStop.stopLocation;
            } else {
                driverMessage += 'από την νέα στάση ' + selectedStop.stopLocation;
            }
                
            if(!userIsInTrip && !requestMade){ 
                console.log('Notification created', userIsInTrip, requestMade);
                
                instance.post('/notifications', {
                    driverId: tripData.driverId,
                    passengerId: Number(userId),
                    tripId: tripData.tripId,    
                    stopId: selectedStop.stopId,
                    message: driverMessage,
                    recipient: 'driver'
                });
                setRequestMade(true);
                setJoinRequestSentAlert(true);
            } else {
                console.log('User is already in trip');
                // alert('Είστε ήδη στο ταξίδι');
            }
        } else {
            console.log('There is no driver or selected stop from handleRequestForJoiningTrip');
        }
    }

    if(tripData){
      // console.log('Trip data', tripData);
      
        return (
            <>
                <IonContent >
                  <TripMapDisplay tripStops={tripData.tripStops} />
                  <IonTitle class="ion-text-center">Πληροφορίες ταξιδιού</IonTitle>
                  <div className="grid-contents">
                    <IonGrid>
                      <IonRow>
                        <IonCol size="7" className="custom-col">
                          <div className="passenger-time-info">
                            <IonItem lines="none">
                              <IonIcon icon={timeOutline} slot="start" className="time-icon" />
                              <IonLabel>{formatDateTime(tripData.startingTime).formattedTime}</IonLabel>
                              <IonIcon icon={calendarOutline} className="calendar-icon" style={{ marginRight: '0.5rem' }} />
                              <IonLabel>{formatDateTime(tripData.startingTime).formattedDate}</IonLabel>
                            </IonItem>
                            <IonItem lines="none">
                              <IonIcon icon={peopleOutline} slot="start" className="people-icon" />
                              <IonLabel>
                                {(tripData.driver ? tripData.noOfPassengers + 1 + '/' + tripData.driver?.vehicle.noOfSeats : tripData.noOfPassengers) + ' συνεπιβάτες'}
                              </IonLabel>
                            </IonItem>
                            <div className="passengers-details">
                              <PassengersDetails passengers={tripData.tripPassengers} />
                            </div>
                            <div className="driver-details">
                              <IonItem lines="none">
                                <IonIcon icon={carOutline} slot="start" className="car-icon" />
                                <IonLabel>Οδηγός</IonLabel>
                              </IonItem>
                              <IonItem lines="none">
                                <IonAvatar style={{ marginRight: '1rem', width: "50%" }}>
                                  <img
                                    src={tripData.driver ? arrayBufferTo64String(tripData.driver.user.profilePicture) : "https://ionicframework.com/docs/img/demos/avatar.svg"}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </IonAvatar>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <IonLabel>{tripData.driver? tripData.driver.user.firstName + ' ' + tripData.driver.user.lastName : 'Δεν υπαρχει οδηγός ακόμα'}</IonLabel>
                                  <StarRating rating={Number(tripData.driver?.user.overallRating)} />
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
                              <g transform="scale(1.4)">
                                {/* used to scale only the arrow and not the rectangle around it */}
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8 18l4 4m0 0l4-4m-4 4V2" />
                              </g>
                            </svg>
                            {tripData.tripStops.map((stop, index) => (
                              <div key={index} className="stop">
                                <HailIcon />
                                {stop.details.stopLocation}
                                <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="80px" viewBox="6 6 20 20">
                                  <g transform="scale(1.4)">
                                    {/* used to scale only the arrow and not the rectangle around it */}
                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8 18l4 4m0 0l4-4m-4 4V2" />
                                  </g>
                                </svg>
                              </div>
                            ))}
                            <SportsScoreIcon />
                            Πρυτανεία
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </div>
                </IonContent>
                {
                  page === "detailedInfo" && 
                    <div className="join-button">
                      <IonButton disabled={userIsInTrip} shape="round" onClick={() => { setStopSelectModal(true) }}>
                          {availabilityMessage}
                      </IonButton>
                      <UserSelectStopModal
                          isOpen={stopSelectModal}
                          onClose={() => setStopSelectModal(false)}
                          availableStops={availableStops}
                          onSelectStop={(stop) => {
                          setSelectedStop(stop);
                          setStopSelectModal(false);
                          }}
                      />
                      <IonAlert
                          isOpen={joinRequestSentAlert}
                          onDidDismiss={() => {
                          setJoinRequestSentAlert(false);
                          history.goBack();
                          }}
                          message={'Η αίτηση σας στάλθηκε επιτυχώς!'}
                          buttons={['OK']}
                          animated={true}
                      />
                    </div>
                } 
                {
                  page === "currentTrip" && 
                    <TripInProgress 
                      startingTime={tripData.startingTime} 
                      tripDriverCurrentUser={tripDriverCurrentUser}
                      setDriverWantsToEndTrip={setDriverWantsToEndTrip}/> 
                }
            </>  
        )
    } else {
        return (
            <IonPage>
                <IonContent>
                    <IonTitle>Δεν υπάρχουν πληροφορίες για το ταξίδι</IonTitle>
                </IonContent>
            </IonPage>
        )
    }

}