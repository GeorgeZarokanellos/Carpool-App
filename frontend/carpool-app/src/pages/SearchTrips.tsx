import React, { useEffect, useState} from 'react';
import { IonButton, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonSearchbar } from '@ionic/react';
import { TripInformation } from '../components/TripInformation';
import { Trip } from '../interfacesAndTypes/Types';
import './SearchTrips.scss';
import instance from '../AxiosConfig';
import { Link, useHistory } from 'react-router-dom';

interface searchTripProps {
  refreshKey: number;
}

const SearchTrips: React.FC<searchTripProps> = (refreshKey) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredResults, setFilteredResults] = useState<Trip[]>([]);
  const history = useHistory();
  let formattedDate;
  let formattedTime;

  //screen dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  useEffect(() => {
    const queryParams = new URLSearchParams({
      userDate: new Date().toLocaleString()
    });

    console.log(queryParams.toString());
    

    instance.get(`/trips?${queryParams.toString()}`)
    .then(response => {
      console.log("response from server", response.data);
      
      setTrips(response.data);
      setFilteredResults(response.data);
      console.log("filtered data from response", filteredResults);
      
    })
    .catch(error => {
      console.log(error);
    });
  
  },[refreshKey])

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
              const date = new Date(trip.startingTime);
                  formattedDate = date.toLocaleDateString();
                  const timeParts = date.toLocaleTimeString().split(':');              
                  const amPm = timeParts[2].split(' ');
                  formattedTime = `${timeParts[0]}:${timeParts[1]} ${amPm[1]}`;
                  // console.log(formattedTime);
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
                <Link to={{pathname: `./trip-info/${trip.tripId}`}} key={trip.tripId} style={{textDecoration: "none"}}>
                  <IonRow className='ion-justify-content-center ion-align-items-center' style={{maxHeight: '15rem'}}>
                      <TripInformation 
                        startingTime={formattedTime} 
                        dateOfTrip={formattedDate} 
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
