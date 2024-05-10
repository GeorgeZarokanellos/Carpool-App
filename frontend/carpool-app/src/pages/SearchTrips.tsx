import React from 'react';
import { IonContent, IonGrid, IonHeader, IonItem, IonPage, IonTitle, IonToolbar, IonRow, IonCol } from '@ionic/react';
import { TripInformation } from '../components/TripInformation';
import './SearchTrips.css';

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search Available Trips</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen >
        <IonGrid >
          <IonRow className='ion-justify-content-center'>
            <IonCol size='3'>
              <TripInformation time='15:00' origin='aretha' noOfPassengers={2} noOfStops={2} finish='University'/>
              <TripInformation time='15:00' origin='aretha' noOfPassengers={2} noOfStops={2} finish='University'/>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
