import React, { useEffect, useState } from 'react';
import { IonAvatar, IonButton, IonContent, IonItem, IonLoading, IonPage, IonTitle} from '@ionic/react';
import './Profile.scss';
import instance from '../AxiosConfig';
import { type ProfileData } from '../interfacesAndTypes/Types';
import { SubmittedReceivedReviewsDisplay } from '../components/ReviewsDisplay';
import { TripsDisplay } from '../components/TripsDisplay';
import { arrayBufferTo64String } from '../util/common_functions';

interface profileProps {
  refreshKey: number;
}

const Profile: React.FC<profileProps> = ({refreshKey}) => {
  const [profileData, setProfileData] = useState<ProfileData>();
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // let rating:number;
    
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    },3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    instance.get(`/profile/${localStorage.getItem('userId')}`)
    .then(response => {
      setProfileData(response.data);
      // console.log("Profile data retrieved: ", profileData);
      if(response.data && response.data.profilePicture){  //check response data because profile data gets set asynchronously
        setImageSrc(arrayBufferTo64String(response.data.profilePicture));
        // console.log("Base64 string: ", base64String);
      }
    })
    .catch(error => {
      console.log(error);
      
    })
  }, [refreshKey]);

  // useEffect(() => {
  //   console.log("imageSrc: ", imageSrc);
  // }, [imageSrc]);

    
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonContent >
          { profileData ? (
            <div className='profile-container'>
              <div className='profile-contents'>
                <div className='profile-picture-container'>
                    {/* <IonLabel>Insert profile <br /> picture below</IonLabel> */}
                    <IonButton fill='clear' onClick={() => document.getElementById('profilePicture')?.click()}>
                        <IonAvatar >
                          <img alt="Silhouette of a person's head" src={imageSrc? imageSrc : "https://ionicframework.com/docs/img/demos/avatar.svg" }/>
                        </IonAvatar>
                      {/* <input type='file' id='profilePicture' hidden required accept='image/*' onChange={e => setProfilePicture(e.target.files?.[0])} /> */}
                    </IonButton>
                  </div>
                <IonTitle>{profileData.firstName} {profileData.lastName}</IonTitle>
                <IonItem lines='none' >
                  {/* <div>
                    {ratingStars}
                  </div> */}
                </IonItem>
                <IonItem lines='none'>
                    < SubmittedReceivedReviewsDisplay submittedReviews={profileData.userSubmittedReviews} userReviews={profileData.userReviews}/>
                </IonItem>
                <IonItem lines='none'>
                  < TripsDisplay tripsCreated={profileData.tripsCreated} tripsParticipated={profileData.tripsParticipated}/>
                </IonItem>
              </div>
            </div>
          ): 
          (
            <IonLoading isOpen={isLoading} message={"Retrieving profile information.."} />
          )
          }
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
