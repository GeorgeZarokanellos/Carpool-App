import React, { useEffect, useState } from 'react';
import { IonAvatar, IonButton, IonContent, IonHeader, IonLoading, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import './Profile.scss';
import instance from '../AxiosConfig';
import { type ProfileData } from '../interfacesAndTypes/Types';
import { SubmittedReceivedReviewsDisplay } from '../components/profile_subcomponents/ReviewsDisplay';
import { TripsDisplay } from '../components/profile_subcomponents/TripsDisplay';
import { arrayBufferTo64String } from '../util/common_functions';
import { Rating } from '@mui/material';
import { MenuButton } from '../components/MenuButton';

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
      <IonPage >
        <div className='centering-container'>
          <div className='limiting-container'>
            <IonHeader>
              <IonToolbar>
                <MenuButton/>
                <IonTitle style={{color: 'black'}}>Profile</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent >
                  <div className='profile-container'>
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
                      <div className='submitted-reviews-container'>
                          < SubmittedReceivedReviewsDisplay submittedReviews={profileData.userSubmittedReviews} userReviews={profileData.userReviews}/>
                      </div>
                      <div className='trips-completed-container'>
                        < TripsDisplay tripsCompleted={profileData.tripsCompleted}/>
                      </div>
                  </div>
            </IonContent>
          </div>
        </div>
      </IonPage>
    );
  } else {
    return (
      <IonLoading isOpen={isLoading} message={"Retrieving profile information.."} />
    )
  }
};

export default Profile;
