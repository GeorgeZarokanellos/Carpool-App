import React, { useEffect } from 'react';
import { IonContent, IonGrid, IonHeader, IonItem, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonSearchbar } from '@ionic/react';
import { TripInformation } from '../components/TripInformation';
import { Trip } from '../interfacesAndTypes/Types';
import './SearchTrips.css';
import instance from '../AxiosConfig';
import { time } from 'console';



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
          <IonRow className='ion-justify-content-center ion-align-items-center'>
            {trips.map((trip,index) => {
              const date = new Date(trip.startingTime);
              formattedDate = date.toLocaleDateString();
              const timeParts = date.toLocaleTimeString().split(':');              
              const amPm = timeParts[2].split(' ');
              formattedTime = `${timeParts[0]}:${timeParts[1]} ${amPm[1]}`;
              console.log(formattedTime);
              
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

export default Tab3;
