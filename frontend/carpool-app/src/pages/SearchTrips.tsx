import React, { useEffect, useState} from 'react';
import { IonButton, IonContent, IonGrid, IonHeader, IonLoading, IonPage, IonRow, IonSearchbar, IonText} from '@ionic/react';
import { TripInformation } from '../components/TripInformation';
import { Trip } from '../interfacesAndTypes/Types';
import './SearchTrips.scss';
import instance from '../AxiosConfig';
import { Link} from 'react-router-dom';
import { formatDateTime } from '../util/common_functions';

interface searchTripProps {
  refreshKey: number;
}

const SearchTrips: React.FC<searchTripProps> = ({refreshKey}) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredResults, setFilteredResults] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userRole = localStorage.getItem('userRole');

  //screen dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  useEffect(() => {
    retrieveTrips();
  },[refreshKey]);

  const retrieveTrips = async () => {
    try {
      const queryParams = new URLSearchParams({
        userDate: new Date().toISOString(),
        });
    
        // console.log("query params", queryParams.toString());
        setIsLoading(true);
        const response = await instance.get(`/trips?${queryParams.toString()}`)
        console.log("Response from server", response.data);
        if(response.data.length > 0){
          setTrips(response.data);
          setFilteredResults(response.data);
        } else {
          console.log("Empty response from server");
        }
        
    } catch (error) {
      console.log("Error retrieving trips", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = (event: CustomEvent) => {
    if(event.detail && event.detail.value === ""){
      console.log("Event content empty", event.detail.value);
      setFilteredResults(trips);
      // console.log("Filtered results", filteredResults);
    }
    else {
      setFilteredResults(trips.filter(trip => trip.startLocation.stopLocation.toLowerCase().includes(event.detail.value.toLowerCase())));
      // console.log("filtered results", filteredResults);
      
    }
  }

  const handleClearSearch = () => {
    setFilteredResults(trips);
  }

  if(trips.length !== 0 && filteredResults.length !== 0){
    return (
        <IonPage style={{width: `${viewportWidth}`, height: `${viewportHeight}`}}>
          <IonHeader className='ion-no-border'>
            <IonSearchbar 
              placeholder='Search available trips' 
              animated={true}
              onIonChange={handleSearch} 
              onIonClear={handleClearSearch}
              color={'primary'}
              class='custom'
            />
          </IonHeader>
          <IonContent >
            <IonGrid >
              <div className='trips-list-container'>
                {
                    filteredResults.map((trip) => {
                      return(
                        <Link to={{pathname: `./trip-info/${trip.tripId}`}} key={trip.tripId + 3} style={{textDecoration: "none"}}>
                          <IonRow className='ion-justify-content-center ion-align-items-center' style={{maxHeight: '17rem', margin: '1.5rem 0rem'}} >
                              <TripInformation 
                                startingTime={formatDateTime(trip.startingTime).formattedTime} 
                                dateOfTrip={formatDateTime(trip.startingTime).formattedDate} 
                                startLocation={trip.startLocation.stopLocation}
                                endLocation={trip.endLocation.stopLocation}
                                noOfPassengers={trip.noOfPassengers}
                                noOfStops={trip.noOfStops}
                                driver={trip.driver? {user: trip.driver.user, vehicle: trip.driver.vehicle} : undefined}
                                tripCreator ={trip.tripCreator}
                                />
                          </IonRow>
                        </Link>
                      )
                    })
                }
              </div>
            </IonGrid>
          </IonContent>
          {
            userRole === 'driver' &&
              <div className='create-trip-button-container'>
                  <IonButton shape='round' routerLink="/main/create-trip">
                    Create a new trip
                  </IonButton>
              </ div>
          }
        </IonPage>
    );
  } else {
    return (
      <IonPage style={{backgroundColor: 'white', color: 'black'}}>
        <IonLoading isOpen={isLoading} message={"Retrieving available trips.."} />
        {
          !isLoading && 
            <div className='no-trips-container'>
              <IonText>No trips available at the moment!</IonText>
            </div>
        }
        {
          userRole === 'driver' &&
            <div className='create-trip-button-container'>
                <IonButton shape='round' routerLink="/main/create-trip">
                  Create a new trip
                </IonButton>
            </ div>
        }
      </IonPage>
    )
  }
};

export default SearchTrips;
