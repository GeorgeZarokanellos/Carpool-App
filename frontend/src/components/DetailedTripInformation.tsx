import { IonAlert, IonButton, IonCol, IonContent, IonGrid, IonLabel, IonLoading, IonRow, IonTitle } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { ExtendedTrip, Stop } from "../interfacesAndTypes/Types";
import instance from "../AxiosConfig";
import './DetailedTripInformation.scss';
import { useHistory } from "react-router";
import { TripMapDisplay } from "./detailed_trip_info_subcomponents/TripMapDisplay";
import { PassengersDetails } from "./detailed_trip_info_subcomponents/PassengersDetails";
import { TripInProgress } from "./detailed_trip_info_subcomponents/TripInProgress";
import { TripDetails } from "./detailed_trip_info_subcomponents/TripDetails";
import { DriverDetails } from "./detailed_trip_info_subcomponents/DriverDetails";
import { StopsDisplay } from "./detailed_trip_info_subcomponents/StopsDisplay";
import { JoinButton } from "./detailed_trip_info_subcomponents/JoinButton";
import { VehicleImagesDisplay } from "./detailed_trip_info_subcomponents/VehicleImagesDisplay";

interface DetailedTripInfoProps {
    clickedTripId: number;
    page: string;
    refreshKey?: number;
}

export const DetailedTripInformation: React.FC<DetailedTripInfoProps> = ({ clickedTripId, page, refreshKey }) => {
  const [tripData, setTripData] = useState<ExtendedTrip>();
  const [vehicleImages, setVehicleImages] = useState<string[]>([]);
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
  const [userPendingRequestTripId, setUserPendingRequestTripId] = useState<number | null>(null);
  //bottom section buttons and messages
  const [currentTripId, setCurrentTripId] = useState(null);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [tripDriverCurrentUser, setTripDriverCurrentUser] = useState(false);
  const [driverWantsToCompleteTrip, setDriverWantsToCompleteTrip] = useState(false);
  const [driverWantsToCancelTrip, setDriverWantsToCancelTrip] = useState(false);
  const [reviewNotificationsSent, setReviewNotificationsSent] = useState(false);
  //loading
  const [isLoading, setIsLoading] = useState(false);
  //trip completion alert
  const [tripStatusAlert, setTripStatusAlert] = useState(false);
  const [tripStatusMessage, setTripStatusMessage] = useState('');
  const [userConfirmedCompletion, setUserConfirmedCompletion] = useState(false);
  const [completionAlertConfirmation, setCompletionAlertConfirmation] = useState(false);
  //trip cancellation alert
  const [userConfirmedCancellation, setUserConfirmedCancellation] = useState(false);
  const [cancellationConfirmationAlert, setCancellationConfirmationAlert] = useState(false);
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');
  const userIdNumber = Number(userId);
  const history = useHistory();

  const retrieveTripData = async () => {
      try {
          if(clickedTripId !== 0){
            setIsLoading(true);
            const response = await instance.get(`/trips/${clickedTripId}`);
            console.log('Trip data', response.data);
            const vehicleImageURLs = await instance.get(`/user/vehicle/${response.data.driverId}`);
            if(response.data.length !== 0){
                setIsLoading(false);
                setTripData(response.data);
                setVehicleImages(vehicleImageURLs.data);

            } else {
                setIsLoading(false);
                console.log('Empty response from server');
            }
          } 
      } catch (error) {
          console.log('Error retrieving trip data', error);
      }
  }

  const checkForNextScheduledTrip = async (userId: string | number, points?: number) => {
    try {
      const userResponse = await instance.get(`/user/${userId}`);
      const {nextScheduledTripId} = userResponse.data;
  
      if(nextScheduledTripId !== null){
        let updateDetails;
        const promises = [];
        if(points === undefined)  //trip cancellation case
          updateDetails = {currentTripId: nextScheduledTripId};
        else  //trip completion case
          updateDetails = {currentTripId: nextScheduledTripId, overallPoints: points};
        //update the current trip of the user to the next scheduled trip
        promises.push(instance.patch(`/user/${userId}`, updateDetails));
  
        //update the next scheduled trip of the user to null or the next closest trip
        const userTripsResponse = await instance.get(`/user/trips/${userId}?currentTripId=${currentTripId}&nextScheduledTripId=${nextScheduledTripId}`);
        
        if(userTripsResponse.data.length === 0){
          promises.push(await instance.patch(`/driver/${userId}`, {nextScheduledTripId: null}));
        } else {
          promises.push(await instance.patch(`/driver/${userId}`, {nextScheduledTripId: userTripsResponse.data[0].tripId}));
        }

        const promiseResponse = await Promise.all(promises);
        console.log("Driver's current and next scheduled trip have been updated!", promiseResponse);
        
      } else {
        //if no next scheduled trip, set the current trip of the user to null
        const updateUser = await instance.patch(`/user/${userId}`, {currentTripId: null});
        console.log('User\'s current trip updated to null. No next scheduled trip', updateUser);
      }
    } catch (error) {
      console.log('Error at checking for next scheduled trip', error);
    }
  }

  const handleTripCompletion = async () => {
    try {
        if(tripData && !reviewNotificationsSent){
          const reviewMessage = 'The trip has been completed successfully. Would you like to review the participants of the trip?';
          const promises = []

          promises.push(
            //update trip status to completed
            instance.patch(`/trips/${tripData.tripId}`, {status: 'completed'})
          )

          //update current trip id of all passengers
          //send review notification to all passengers  
          if(tripData.tripPassengers.length > 0){
            tripData.tripPassengers.forEach((passenger) => {
              promises.push(
                instance.patch(`/user/${passenger.passengerId}`, {currentTripId: null})
              );
              promises.push(
                instance.post('/notifications', {
                  driverId: tripData.driverId,
                  passengerId: passenger.passengerId,
                  tripId: tripData.tripId,    
                  stopId: null,
                  message: reviewMessage,
                  recipient: 'passenger',
                  type: 'review'
                })
              );
            });
          
            promises.push(
              //send review notification to driver
              instance.post('/notifications', {
                driverId: tripData.driverId,
                passengerId: null,
                tripId: tripData.tripId,    
                stopId: null,
                message: reviewMessage,
                recipient: 'driver',
                type: 'review'
              })
            )
          }

          //await all promises
          await Promise.all(promises);
          setReviewNotificationsSent(true);
          setTripStatusMessage('The trip has been completed successfully!');
          setTripStatusAlert(true);
          //TODO add alert messages for next scheduled trip
          if(userId === null){
            console.log("User id is null in local storage");
          } else {
            await checkForNextScheduledTrip(userId,5);
          }

      
        } else {
          console.log('Review notifications already sent');
        }
      } catch (error) {
        console.log('Error handling trip completion', error);
      }
  }

  const handleTripCancellation = async () => {
    if (tripData) {
      try {
        // Update trip status to 'cancelled'
        await instance.patch(`/trips/${tripData.tripId}`, { status: 'cancelled' });
        // Update current trip ID for passengers and send notifications
        if (tripData.noOfPassengers > 0 && tripData.tripPassengers.length > 0) {
          const passengerUpdates = tripData.tripPassengers.map(async (passenger) => {
            try {
              // Set passenger's current trip to null
              await instance.patch(`/user/${passenger.passengerId}`, { currentTripId: null });
              // Send notification to passenger
              await instance.post('/notifications', {
                driverId: tripData.driverId,
                passengerId: passenger.passengerId,
                tripId: tripData.tripId,
                stopId: null,
                message: 'This trip has been cancelled by the driver!',
                recipient: 'passenger',
                type: 'cancel'
              });
            } catch (error) {
              console.error(`Error updating passenger ${passenger.passengerId}`, error);
            }
          });
    
          // Run all passenger updates concurrently
          await Promise.all(passengerUpdates);
        }
    
        // Update current trip ID of the driver to null
        try {
          await instance.patch(`/user/${tripData.driverId}`, { currentTripId: null });
        } catch (error) {
          console.error(`Error updating current trip id of driver ${tripData.driverId}`, error);
        }
    
        // Set trip status message and alert
        setTripStatusMessage('The trip has been cancelled successfully!');
        setTripStatusAlert(true);
        if(userId === null){
          console.log("User id is null in local storage");
        } else {
          await checkForNextScheduledTrip(userId);
        }
    
      } catch (error) {
        console.error('Error during trip cancellation process', error);
      }
    }
    
  }

  const fetchUsersInfo = async () => {
      try {
          const response = await instance.get(`/user/${userId}`);
          if(response.data){
              setFirstName(response.data.firstName);
              setLastName(response.data.lastName);
              setOverallRating(response.data.overallRating);
              setCurrentTripId(response.data.currentTripId);
              setUserPendingRequestTripId(response.data.pendingRequestTripId);
          }
      } catch (error) {
          console.log("Error fetching user's full name and rating", error);
      }
  }

  const checkAvailability = () => {
      if(tripData && page === 'detailedInfo'){
         if (!userIsInTrip){
          switch(userPendingRequestTripId){
            case null:
              setAvailabilityMessage('Request to join');
              break;
            case tripData.tripId:
              setAvailabilityMessage('Request already sent. Waiting for driver response');
              break;
            default: 
              setAvailabilityMessage('You have a pending request in another trip');
          }
        } else {
            if(currentTripId !== null && currentTripId === tripData.tripId){
                setAvailabilityMessage('You re already participating in this trip');
            } else {
                setAvailabilityMessage('You participate in another trip');
            }
        }

      }
      
  }

  const filterAvailableStops = async() => {
    if(tripData){
      if(tripData.startLocation.stopLocation !== 'Prytaneia'){
        await instance.get(`/stops/${tripData.startLocation.side}`)
        .then(response => {
            setAvailableStops(response.data);
        })
        .catch(error => {
            console.log(error);
        });
      } else {
        await instance.get(`/stops/${tripData.endLocation.side}`)
        .then(response => {
            setAvailableStops(response.data);
        })
        .catch(error => {
            console.log(error);
        });
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

  const handleRequestForJoiningTrip = async () => {      
      if(tripData && tripData.driver && selectedStop){
          let driverMessage: string =  firstName + ' ' + lastName + ' with a rating of ' + overallRating + ' wants to join your trip ';
          let stopExists = false;
          tripData.tripStops.forEach((stop) => {
              if(stop.stopId === selectedStop.stopId){
                  stopExists = true;
              } 
          });

          if(selectedStop.stopId === tripData.startLocationId){
              stopExists = true;
          }

          if(stopExists){
              driverMessage += 'from the ' + selectedStop.stopLocation + ' stop';
          } else {
              driverMessage += 'from the new ' + selectedStop.stopLocation + ' stop';
          }
              
          if(!userPendingRequestTripId){ 
            try {
              await instance.post('/notifications', {
                  driverId: tripData.driverId,
                  passengerId: Number(userId),
                  tripId: tripData.tripId,    
                  stopId: selectedStop.stopId,
                  message: driverMessage,
                  recipient: 'driver',
                  type: 'request'
              });
  
              await instance.patch(`/user/${userId}`, {
                pendingRequestTripId: tripData.tripId
              });

              setJoinRequestSentAlert(true);
            } catch (error) {
              console.log('Error sending request to driver', error);
            }
          } else {
              console.log('User is already in trip');
          }
      } else {
          console.log('There is no driver or selected stop from handleRequestForJoiningTrip');
      }
  }

  useEffect(() => {
    fetchUsersInfo();
    checkIfUserIsInTrip();
    checkAvailability();
    filterAvailableStops();
  }, [userIsInTrip, tripData]);

  useEffect(() => {
      retrieveTripData();
  }, [clickedTripId, refreshKey]);

  useEffect(() => {
    if (selectedStop) {
      handleRequestForJoiningTrip();
    }
  }, [selectedStop]);

  useEffect(() => {
    if (driverWantsToCompleteTrip) {
      setCompletionAlertConfirmation(true);
    }
  }, [driverWantsToCompleteTrip]);

  useEffect(() => {
    if (userConfirmedCompletion) {
      handleTripCompletion();
    } else {
      setDriverWantsToCompleteTrip(false);
    }
  }, [userConfirmedCompletion]);

  useEffect(() => {
    if (driverWantsToCancelTrip) {
      setCancellationConfirmationAlert(true);
    }
  }, [driverWantsToCancelTrip]);

  useEffect(() => {
    if (userConfirmedCancellation) {
      handleTripCancellation();
    }
  }, [userConfirmedCancellation]);

  if(tripData){
      return (
          <>
              <IonContent >
                  <TripMapDisplay 
                    tripStops={tripData.tripStops} 
                    startLocation={tripData.startLocation} 
                    endLocation={tripData.endLocation}
                    tripInProgress={tripData.status === 'in_progress'} 
                  />
                <div className="grid-contents">
                  <IonTitle class="ion-text-center">Trip Information</IonTitle>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="7" className="custom-col">
                        <div className="passenger-time-info">
                          <TripDetails startingTime={tripData.startingTime} driver={tripData.driver} noOfPassengers={tripData.noOfPassengers} />
                          <PassengersDetails passengers={tripData.tripPassengers} />
                          <DriverDetails driver={tripData.driver} />
                        </div>
                      </IonCol>
                      <IonCol size="5" className="custom-col">
                        <StopsDisplay stopLocationStart={tripData.startLocation.stopLocation} stopLocationEnd={tripData.endLocation.stopLocation} tripStops={tripData.tripStops}/>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                  <VehicleImagesDisplay vehicleImages={vehicleImages} />
                </div>
              </IonContent>
              {
                page === "detailedInfo" && userRole === 'passenger' &&
                <JoinButton 
                  userIsInTrip={userIsInTrip}
                  availabilityMessage={availabilityMessage}
                  stopSelectModal={stopSelectModal}
                  endLocationId={tripData.endLocationId}
                  availableStops={availableStops}
                  joinRequestSentAlert={joinRequestSentAlert}
                  userRequestedToJoinInTrip={userPendingRequestTripId !== null || userPendingRequestTripId === tripData.tripId}
                  setStopSelectModal={setStopSelectModal}
                  setSelectedStop={setSelectedStop}
                  setJoinRequestSentAlert={setJoinRequestSentAlert}
                />
              } 
              {
                page === "currentTrip" && 
                  <TripInProgress 
                    refreshKey={refreshKey}
                    tripData={tripData}
                    tripDriverCurrentUser={tripDriverCurrentUser}
                    userRole={userRole}
                    userId={userId}
                    setDriverWantsToEndTrip={setDriverWantsToCompleteTrip}
                    setDriverWantsToAbortTrip={setDriverWantsToCancelTrip}
                    checkForNextScheduledTrip={checkForNextScheduledTrip}
                  /> 
              }
              {
                <>
                  <IonAlert 
                    isOpen={tripStatusAlert}
                    onDidDismiss={() => {
                      setTripStatusAlert(false);
                      history.push('/main/search-trips');
                      window.location.reload();
                    }}
                    message={tripStatusMessage}
                    buttons={['OK']}
                    animated={true}
                  />
                  <IonAlert 
                    isOpen={completionAlertConfirmation}
                    onDidDismiss={() => {
                      setCompletionAlertConfirmation(false);
                      
                    }}
                    header="End trip"
                    message={'Are you sure you want to end the trip?'}
                    buttons={[
                      {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                          setUserConfirmedCompletion(false);
                        }
                      },
                      {
                        text: 'Yes',
                        handler: () => {
                          setUserConfirmedCompletion(true);
                        }
                      }
                    ]}
                  />
                  <IonAlert 
                    isOpen={cancellationConfirmationAlert}
                    message={'Are you sure you want to cancel the trip?'}
                    buttons={[
                      {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                          setUserConfirmedCancellation(false);
                        }
                      },
                      {
                        text: 'Yes',
                        handler: () => {
                          setUserConfirmedCancellation(true);
                        }
                      }
                    ]}
                  />
                </>
              }
          </>  
      )
    } else {
      return (
        <>
          <IonLoading isOpen={isLoading} message={'Loading trip information...'} />
          {
            !isLoading && 
              <div className="no-current-trip">
                <IonButton routerLink="/main/search-trips" shape="round" fill="clear">
                  <IonLabel >
                    No current trip.<br />
                  { userRole === 'driver' ?  'Create one here!': 'Search for one here!'}
                  </IonLabel>
                </IonButton>
              </div>
          }
        </>
      )
    }

}