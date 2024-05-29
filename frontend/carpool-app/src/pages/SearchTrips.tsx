import React, { useEffect} from 'react';
import { IonContent, IonGrid, IonHeader, IonPage, IonRow, IonSearchbar } from '@ionic/react';
import { TripInformation } from '../components/TripInformation';
import { Trip } from '../interfacesAndTypes/Types';
import './SearchTrips.scss';
import instance from '../AxiosConfig';

interface searchTripProps {
  refreshKey: number;
}

const SearchTrips: React.FC<searchTripProps> = (refreshKey) => {
  const [trips, setTrips] = React.useState<Trip[]>([]);
  let formattedDate;
  let formattedTime;


  useEffect(() => {
    instance.get('/trips')
    .then(response => {
      console.log('response',response);
      setTrips(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  
  },[refreshKey])




  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonSearchbar placeholder='Search available trips' animated={true} class='custom'/>
      </IonHeader>
      <IonContent >
        <IonGrid >
          <IonRow className='ion-justify-content-center ion-align-items-center'>
            {trips.map((trip) => {
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
                    driver={trip.driver}
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
