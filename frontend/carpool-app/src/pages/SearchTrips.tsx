import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
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
      <IonContent fullscreen>
        <TripInformation time='15:00' origin='aretha' noOfPassengers={2} noOfStops={2} />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
