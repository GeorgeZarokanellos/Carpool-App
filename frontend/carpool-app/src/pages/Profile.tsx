import React, { useEffect, useState } from 'react';
import { IonAvatar, IonButton, IonContent, IonItem, IonLoading, IonPage, IonTitle} from '@ionic/react';
import './Profile.scss';
import instance from '../AxiosConfig';
import { type ProfileData } from '../interfacesAndTypes/Types';
import { SubmittedReceivedReviewsDisplay } from '../components/ReviewsDisplay';
import { TripsDisplay } from '../components/TripsDisplay';
import { arrayBufferTo64String } from '../util/common_functions';
import { Rating } from '@mui/material';

interface profileProps {
  refreshKey: number;
}

const Profile: React.FC<profileProps> = ({refreshKey}) => {
  const [profileData, setProfileData] = useState<ProfileData>();
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
    
  useEffect(() => {
    if(profileData !== undefined){
      setIsLoading(false);
    }
    

  }, [profileData]);

  useEffect(() => {
    retrieveProfileData();
  }, [refreshKey]);
  
  const retrieveProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get(`/profile/${localStorage.getItem('userId')}`);
      setProfileData(response.data);
      console.log("Profile data retrieved: ", response.data);
      if(response.data && response.data.profilePicture){  //check response data because profile data gets set asynchronously
        setImageSrc(arrayBufferTo64String(response.data.profilePicture));
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  if(profileData !== undefined){
    return (
      <IonPage>
        <IonContent fullscreen>
          <IonContent >
              <div className='profile-container'>
                <div className='profile-contents'>
                  <div className='profile-picture-container'>
                      <IonButton fill='clear' onClick={() => document.getElementById('profilePicture')?.click()}>
                          <IonAvatar >
                            <img alt="Silhouette of a person's head" src={imageSrc? imageSrc : "https://ionicframework.com/docs/img/demos/avatar.svg" }/>
                          </IonAvatar>
                      </IonButton>
                    </div>
                  <div className='user-name-rating-container'>
                    <IonTitle>{profileData.firstName} {profileData.lastName}</IonTitle>
                    <div className='user-rating'>
                      <Rating name="read-only" value={Number(profileData.overallRating)} readOnly />
                      {'(' + profileData.overallRating + ')'}
                    </div>
                    {" from " + profileData.userReviews.length + " reviews"}
                  </div>
                  <IonItem lines='none'>
                      < SubmittedReceivedReviewsDisplay submittedReviews={profileData.userSubmittedReviews} userReviews={profileData.userReviews}/>
                  </IonItem>
                  <IonItem lines='none'>
                    < TripsDisplay tripsCompleted={profileData.tripsCompleted}/>
                  </IonItem>
                </div>
              </div>
          </IonContent>
        </IonContent>
      </IonPage>
    );
  } else {
    return (
      <IonLoading isOpen={isLoading} message={"Retrieving profile information.."} />
    )
  }
};

export default Profile;
