import { IonAlert, IonButton, IonCol, IonContent, IonGrid, IonLoading, IonRow, IonText, IonTitle } from "@ionic/react";
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
}

export const DetailedTripInformation: React.FC<DetailedTripInfoProps> = ({ clickedTripId, page }) => {
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
  const [requestMade, setRequestMade] = useState(false);
  //bottom section buttons and messages
  const [currentTripId, setCurrentTripId] = useState(null);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [tripDriverCurrentUser, setTripDriverCurrentUser] = useState(false);
  const [driverWantsToEndTrip, setDriverWantsToEndTrip] = useState(false);
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
            // console.log('Vehicle images', vehicleImageURLs.data);
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

  const handleTripCompletion = async () => {
    if(tripData && !reviewNotificationsSent){
        //update trip status to completed
        await instance.patch(`/trips/${tripData.tripId}`, {
          status: 'completed'
        }).then(response => {
          console.log('Trip ended', response);
        }).catch(error => {
          console.log('Error ending trip', error);
        });

      //update current trip id of all passengers and driver to null
      //send review notification to all passengers  
      const reviewMessage = 'The trip has been completed successfully. Would you like to review the participants of the trip?';
      tripData.tripPassengers.forEach(async (passenger) => {

        await instance.put(`/user/${passenger.passengerId}`, {
          currentTripId: null
        }).then(response => {
          console.log(`Current trip id of passenger ${passenger.passengerId} updated to null`, response);
        }).catch(error => {
          console.log(`Error updating current trip id of passenger ${passenger.passengerId} to null`, error);
        })

        await instance.post('/notifications', {
            driverId: tripData.driverId,
            passengerId: passenger.passengerId,
            tripId: tripData.tripId,    
            stopId: null,
            message: reviewMessage,
            recipient: 'passenger',
            type: 'review'
        })
        .then(response => {
          console.log(`Review notification sent to passenger ${passenger.passengerId}`, response);
        })
        .catch(error => {
          console.log(`Error sending review notification to passenger ${passenger.passengerId}`, error);
        })
      });
      
      //update current trip id of driver to null
      await instance.put(`/user/${tripData.driverId}?type=points`, {
        currentTripId: null,
        overallPoints: 5
      }).then(response => {
        console.log(`Current trip id of driver ${tripData.driverId} updated to null`, response);
      }).catch(error => {
        console.log(`Error updating current trip id of driver ${tripData.driverId} to null`, error);
      })
      //send review notification to driver
      await instance.post('/notifications', {
        driverId: tripData.driverId,
        passengerId: null,
        tripId: tripData.tripId,    
        stopId: null,
        message: reviewMessage,
        recipient: 'driver',
        type: 'review'
      })
      .then(response => {
        console.log(`Review notification sent to driver ${tripData.driverId}`, response);
      })
      .catch(error => {
        console.log(`Error sending review notification to driver ${tripData.driverId}`, error);
      });

      setReviewNotificationsSent(true);
      setTripStatusMessage('The trip has been completed successfully!');
      setTripStatusAlert(true);
      
    } else {
      console.log('Review notifications already sent');
    }
  }

  const handleTripCancellation = async () => {
    if(tripData){
      //update trip status to cancelled
      await instance.patch(`/trips/${tripData.tripId}`, {
        status: 'cancelled'
      })
      .then(response => {
        console.log('Trip cancelled', response);
      })
      .catch(error => {
        console.log('Error cancelling trip', error);
      });

      //update current trip id of all passengers and send notification of cancellation
      tripData.tripPassengers.forEach(async (passenger)=> {
        await instance.put(`/user/${passenger.passengerId}`, {
          currentTripId: null
        }).then(response => {
          console.log(`Current trip id of passenger ${passenger.passengerId} updated to null`, response);
        }).catch(error => {
          console.log(`Error updating current trip id of passenger ${passenger.passengerId} to null`, error);
        })

        await instance.post('/notifications', {
          driverId: tripData.driverId,
          passengerId: passenger.passengerId,
          tripId: tripData.tripId,    
          stopId: null,
          message: 'This trip has been cancelled by the driver!',
          recipient: 'passenger',
          type: 'info'
        })

      });

      //update current trip id of driver to null
      await instance.put(`/user/${tripData.driverId}`, {
        currentTripId: null
      }).then(response => {
        console.log(`Current trip id of driver ${tripData.driverId} updated to null`, response);
      }).catch(error => {
        console.log(`Error updating current trip id of driver ${tripData.driverId} to null`, error);
      });

      setTripStatusMessage('The trip has been cancelled successfully!');
      setTripStatusAlert(true);
    }
  }

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
            setAvailabilityMessage(tripData.noOfPassengers + 1 < tripData.driver.vehicle.noOfSeats ? 'Request to join' : 'Vehicle Full');
        } else if (tripData.driver === null && !userIsInTrip){
          if(userRole === 'passenger'){
            setAvailabilityMessage(tripData.noOfPassengers < 4 ? 'Request to join' : 'There is no driver yet');
          } 
        } else if (userIsInTrip){
            if(currentTripId !== null && currentTripId === tripData.tripId){
                setAvailabilityMessage('You re already participating in this trip');
            } else {
                setAvailabilityMessage('You participate in another trip');
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
          let driverMessage: string =  firstName + ' ' + lastName + ' with a rating of ' + overallRating + ' wants to join your trip ';
          let stopExists = false;
          tripData.tripStops.forEach((stop) => {
              if(stop.stopId === selectedStop.stopId){
                  console.log('User selected stop is the same as an existing stop');
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
              
          if(!userIsInTrip && !requestMade){ 
              console.log('Notification created', userIsInTrip, requestMade);
              
              instance.post('/notifications', {
                  driverId: tripData.driverId,
                  passengerId: Number(userId),
                  tripId: tripData.tripId,    
                  stopId: selectedStop.stopId,
                  message: driverMessage,
                  recipient: 'driver',
                  type: 'request'
              });
              setRequestMade(true);
              setJoinRequestSentAlert(true);
          } else {
              console.log('User is already in trip');
          }
      } else {
          console.log('There is no driver or selected stop from handleRequestForJoiningTrip');
      }
  }

  useEffect(() => {
    fetchUsersFullName();
  }, []);

  useEffect(() => {
    checkAvailability();
  }, [userIsInTrip, tripData]);

  useEffect(() => {
      retrieveTripData();
  }, [clickedTripId]);

  useEffect(() => {
    if(tripData){
      //filter the available stops based on the side of the start location
      //if the start location is Prytaneia, then the available stops are based on the side of the end location
        if(tripData.startLocation.stopLocation !== 'Prytaneia'){
            instance.get(`/stops/${tripData.startLocation.side}`)
            .then(response => {
                setAvailableStops(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        } else {
          instance.get(`/stops/${tripData.endLocation.side}`)
          .then(response => {
            console.log('Available stops', response.data);
          })
          .catch(error => {
              console.log(error);
          });
        }
        checkIfUserIsInTrip();
    }
  }, [tripData]);

  useEffect(() => {
    if (selectedStop) {
      handleRequestForJoiningTrip();
    }
  }, [selectedStop]);

  useEffect(() => {
    if (driverWantsToEndTrip) {
      setCompletionAlertConfirmation(true);
    }
  }, [driverWantsToEndTrip]);

  useEffect(() => {
    if (userConfirmedCompletion) {
      handleTripCompletion();
    } else {
      setDriverWantsToEndTrip(false);
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
                <div id="map" className="map-container">
                  <TripMapDisplay tripStops={tripData.tripStops} startLocation={tripData.startLocation} endLocation={tripData.endLocation}/>
                </div>
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
                page === "detailedInfo" && 
                <JoinButton 
                  userIsInTrip={userIsInTrip}
                  availabilityMessage={availabilityMessage}
                  stopSelectModal={stopSelectModal}
                  endLocationId={tripData.endLocationId}
                  availableStops={availableStops}
                  joinRequestSentAlert={joinRequestSentAlert}
                  setStopSelectModal={setStopSelectModal}
                  setSelectedStop={setSelectedStop}
                  setJoinRequestSentAlert={setJoinRequestSentAlert}
                />
              } 
              {
                page === "currentTrip" && 
                  <TripInProgress 
                    startingTime={tripData.startingTime} 
                    tripDriverCurrentUser={tripDriverCurrentUser}
                    driverId={tripData.driverId}
                    tripStatus={tripData.status}
                    setDriverWantsToEndTrip={setDriverWantsToEndTrip}
                    setDriverWantsToAbortTrip={setDriverWantsToCancelTrip}  
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
                <IonButton routerLink="/main/search-trips" shape="round" >
                  <IonText>
                  { userRole === 'driver' ? (
                      <>
                          No current trip.<br />
                          Create one here!
                      </>
                    ) : (
                      <>
                          No current trip.<br />
                          Search for one here!
                      </>
                    )}
                  </IonText>
                </IonButton>
              </div>
          }
        </>
      )
    }

}