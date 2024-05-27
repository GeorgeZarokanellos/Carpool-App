import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Profile.css';
import instance from '../AxiosConfig';

const Profile: React.FC = () => {
  const username = 'John Doe';
  
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader>
            <IonToolbar>
                <IonTitle>{username}</IonTitle>
            </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
