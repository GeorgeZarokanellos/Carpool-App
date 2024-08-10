import React, { useEffect, useState} from 'react';
import { IonButton, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonSearchbar } from '@ionic/react';
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
  const history = useHistory();


  //screen dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  useEffect(() => {
    console.log("refresh key", refreshKey);
    

    const queryParams = new URLSearchParams({
      userDate: new Date().toLocaleString()
    });

    instance.get(`/trips?${queryParams.toString()}`)
    .then(response => {
      console.log("response from server", response.data);
      
      setTrips(response.data);
      setFilteredResults(response.data);
      // console.log("filtered data from response", filteredResults);
      
    })
    .catch(error => {
      console.log(error);
    });
  
  },[refreshKey]);

  const handleSearch = (event: CustomEvent) => {
    if(event.detail && event.detail.value === ""){
      console.log("Event content empty", event.detail.value);
      setFilteredResults(trips);
      // console.log("Filtered results", filteredResults);
    }
    else {
      setFilteredResults(trips.filter(trip => trip.startLocation.toLowerCase().includes(event.detail.value.toLowerCase())));
      // console.log("filtered results", filteredResults);
      
    }
  }

  const handleClearSearch = () => {
    setFilteredResults(trips);
  }

  const transferToNewTripPage = () => {
    history.push("/main/create-trip")
  }

  useEffect(() => {
    console.log("filtered results", filteredResults);
  }, [filteredResults]);

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
            filteredResults.map((trip) => {
                  if(trip.driver === null || trip.driver === undefined){  //if there is no driver assigned to the trip
                    trip.driver = {
                      user: {
                        firstName: 'No driver yet',
                        lastName: '',
                        overallRating: '0'
                      },
                      vehicle: {
                        noOfSeats: 0
                      }
                    }
                  }
              return(
                <Link to={{pathname: `./trip-info/${trip.tripId}`}} key={trip.tripId + 3} style={{textDecoration: "none"}}>
                  <IonRow className='ion-justify-content-center ion-align-items-center' style={{maxHeight: '15rem', margin: '1.5rem 0rem'}} >
                      <TripInformation 
                        startingTime={formatDateTime(trip.startingTime).formattedTime} 
                        dateOfTrip={formatDateTime(trip.startingTime).formattedDate} 
                        origin={trip.startLocation}
                        noOfPassengers={trip.noOfPassengers}
                        noOfStops={trip.noOfStops}
                        finish='Πρυτανεία'
                        driver={{user: trip.driver.user}}
                        tripCreator ={trip.tripCreator}
                        />
                      
                  </IonRow>
                </Link>
              )
            })}
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
