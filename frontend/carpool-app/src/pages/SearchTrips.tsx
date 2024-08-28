import React, { useEffect, useState} from 'react';
import { IonButton, IonContent, IonGrid, IonHeader, IonLoading, IonPage, IonRow, IonSearchbar } from '@ionic/react';
import { TripInformation } from '../components/TripInformation';
import { Trip } from '../interfacesAndTypes/Types';
import './SearchTrips.scss';
import instance from '../AxiosConfig';
import { Link, useHistory } from 'react-router-dom';
import { formatDateTime } from '../util/common_functions';

interface searchTripProps {
  refreshKey: number;
}

const SearchTrips: React.FC<searchTripProps> = ({refreshKey}) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredResults, setFilteredResults] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const history = useHistory();


  //screen dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  useEffect(() => {
    retrieveTrips();
  },[refreshKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  },[])

  const retrieveTrips = async () => {
    try {
      const queryParams = new URLSearchParams({
        userDate: new Date().toISOString(),
        });
    
        // console.log("query params", queryParams.toString());
        
        const response = await instance.get(`/trips?${queryParams.toString()}`)
        console.log("Response from server", response.data);

        setTrips(response.data);
        setFilteredResults(response.data);
        
    } catch (error) {
      console.log("Error retrieving trips", error);
      
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

  const transferToNewTripPage = () => {
    history.push("/main/create-trip")
  }

  return (
    <IonPage style={{width: `${viewportWidth}`, height: `${viewportHeight}`}}>
      <IonHeader className='ion-no-border'>
        <IonSearchbar 
          placeholder='Search available trips' 
          animated={true}
          onIonChange={handleSearch} 
          onIonClear={handleClearSearch}
          class='custom'/>
      </IonHeader>
      <IonContent >
        <IonGrid >
          <div className='trips-list-container'>
            {
              filteredResults.length !== 0 ? (
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
                  )}
              )) : (
                <IonLoading isOpen={isLoading} message={"Retrieving trip information.."} />
              )
            }
          </div>
        </IonGrid>
      </IonContent>
      <div className='create-trip-button-container'>
        <IonButton shape='round' onClick={transferToNewTripPage}>
          Create a new trip
        </IonButton>
      </ div>
    </IonPage>
  );
};

export default SearchTrips;
