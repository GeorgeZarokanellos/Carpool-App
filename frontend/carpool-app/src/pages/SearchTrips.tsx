import React, { useEffect, useState} from 'react';
import { IonContent, IonGrid, IonHeader, IonPage, IonRow, IonSearchbar } from '@ionic/react';
import { TripInformation } from '../components/TripInformation';
import { Trip } from '../interfacesAndTypes/Types';
import './SearchTrips.scss';
import instance from '../AxiosConfig';

interface searchTripProps {
  refreshKey: number;
}

const SearchTrips: React.FC<searchTripProps> = (refreshKey) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredResults, setFilteredResults] = useState<Trip[]>([]);
  let formattedDate;
  let formattedTime;


  useEffect(() => {
    instance.get('/trips')
    .then(response => {
      console.log('response',response);
      setTrips(response.data);
      setFilteredResults(response.data);
      console.log("filtered data from response", filteredResults);
      
    })
    .catch(error => {
      console.log(error);
    });
  
  },[refreshKey])

  const handleSearch = (event: CustomEvent) => {
    console.log(event.detail.value);
    if(event.detail.value === ""){
      console.log("Event content empty", event.detail.value);
      setFilteredResults(trips);
      console.log("Filtered results", filteredResults);
      
    }
    else {
      console.log(filteredResults.map((trip)=> trip.startLocation));
      
      console.log(filteredResults.filter(trip => trip.startLocation.toLowerCase().includes(event.detail.value.toLowerCase())));
      setFilteredResults(trips.filter(trip => trip.startLocation.toLowerCase().includes(event.detail.value.toLowerCase())));
      console.log("filtered results", filteredResults);
      
    }
  }



  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonSearchbar 
          placeholder='Search available trips' 
          animated={true}
          onIonChange={handleSearch} 
          class='custom'/>
      </IonHeader>
      <IonContent >
        <IonGrid >
          <IonRow className='ion-justify-content-center ion-align-items-center'>
            {filteredResults.map((trip) => {
              // console.log(trip);
              // console.log(trip.driver.user);
              
              const date = new Date(trip.startingTime);
              formattedDate = date.toLocaleDateString();
              const timeParts = date.toLocaleTimeString().split(':');              
              const amPm = timeParts[2].split(' ');
              formattedTime = `${timeParts[0]}:${timeParts[1]} ${amPm[1]}`;
              // console.log(formattedTime);
              
              return(
                  <TripInformation 
                    key={trip.tripId}
                    startingTime={formattedTime} 
                    dateOfTrip={formattedDate} 
                    origin={trip.startLocation}
                    noOfPassengers={trip.noOfPassengers}
                    noOfStops={trip.noOfStops}
                    finish='Πρητανεία'
                    driver={{user: trip.driver.user}}
                    tripCreator ={trip.tripCreator}
                    />
              )
            })}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SearchTrips;
