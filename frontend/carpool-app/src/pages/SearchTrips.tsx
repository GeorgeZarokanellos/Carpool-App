import React, { useEffect } from 'react';
import { IonContent, IonGrid, IonHeader, IonItem, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonSearchbar } from '@ionic/react';
import { TripInformation } from '../components/TripInformation';
import { Trip } from '../interfacesAndTypes/Types';
import './SearchTrips.css';
import instance from '../AxiosConfig';



const Tab3: React.FC = () => {
  const [trips, setTrips] = React.useState<Trip[]>([]);
  let formattedDate;
  let formattedTime;

  useEffect(() => {
    instance.get('/trips')
    .then(response => {
      console.log(response.data);
      setTrips(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  
  },[])


  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonSearchbar placeholder='Search available trips' animated={true} class='custom'/>
      </IonHeader>
      <IonContent fullscreen >
        <IonGrid >
          <IonRow className='ion-justify-content-center'>
            {trips.map((trip,index) => {
              const date = new Date(trip.startingTime);
              formattedDate = date.toLocaleDateString();
              formattedTime = date.toLocaleTimeString();
              return(
                <TripInformation 
                  key={trip.tripId}
                  startingTime={formattedTime} 
                  dateOfTrip={formattedDate} 
                  origin={trip.startLocation}
                  noOfPassengers={trip.noOfPassengers}
                  noOfStops={trip.noOfStops}
                  finish='Pritaneia'
                  />
              )
            })}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
