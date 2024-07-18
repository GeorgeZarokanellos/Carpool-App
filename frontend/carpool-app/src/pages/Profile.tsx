import React, { useEffect, useState } from 'react';
import { IonAvatar, IonButton, IonContent, IonItem, IonLoading, IonPage, IonTitle} from '@ionic/react';
import './Profile.scss';
import instance from '../AxiosConfig';
import { type ProfileData } from '../interfacesAndTypes/Types';
import { SubmittedReceivedReviewsDisplay } from '../components/ReviewsDisplay';
import { TripsDisplay } from '../components/TripsDisplay';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>();
  const [imageSrc, setImageSrc] = useState<string>('');
  let base64String = '';
  // let rating:number;
    


  useEffect(() => {
    instance.get(`/profile/${localStorage.getItem('userId')}`)
    .then(response => {
      setProfileData(response.data);
      // console.log("Profile data retrieved: ", profileData);
      if(response.data && response.data.profilePicture){  //check response data because profile data gets set asynchronously
        base64String = btoa(String.fromCharCode(...response.data.profilePicture.data));
        setImageSrc(`data:image/jpeg;base64,${base64String}`);
        // console.log("Base64 string: ", base64String);
        
      }
    })
    .catch(error => {
      console.log(error);
      
    })
  }, []);

  // useEffect(() => {
  //   console.log("Profile data: ", profileData);
  // }, [profileData]);
    
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
          ): ''
          // (
            // <IonLoading isOpen={true} message={"Retrieving profile information.."} />
          // )
          }
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
