import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonLoading, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Profile.scss';
import instance from '../AxiosConfig';
import { type ProfileData } from '../interfacesAndTypes/Types';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>();

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const response = await instance.get(`/profile/${localStorage.getItem('userId')}`);
      console.log(response);
      setProfileData(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen>
      { profileData? (
          <>
            <IonHeader>
                <IonToolbar class='ion-text-center'>
                    <IonTitle >{profileData.firstName + ' ' + profileData.lastName}</IonTitle>
                </IonToolbar>
            </IonHeader>
          </>
        ) : (
          <IonLoading isOpen={!profileData} message="Fetching Profile Data" />
        )
      }
      </IonContent>
    </IonPage>
  );
};

export default Profile;
