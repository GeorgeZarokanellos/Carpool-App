import React, { useEffect, useState } from 'react';
import { IonContent, IonIcon, IonImg, IonItem, IonLoading, IonPage, IonTitle} from '@ionic/react';
import './Profile.scss';
import instance from '../AxiosConfig';
import { type ProfileData } from '../interfacesAndTypes/Types';
import { SubmittedReceivedReviewsDisplay } from '../components/ReviewsDisplay';
import { TripsDisplay } from '../components/TripsDisplay';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>();
  const [imageUrl, setImageUrl] = useState<string>('');
  // let rating:number;

  // function bufferToBase64(buffer: Buffer){
  //   let binary = '';
  //   const bytes = [].slice.call(new Uint8Array(buffer));
  //   bytes.forEach((b) => binary += String.fromCharCode(b));
  //   return window.btoa(binary);
  // }

  useEffect(() => {
    instance.get(`/profile/${localStorage.getItem('userId')}`)
    .then(response => {
      setProfileData(response.data);
      console.log("Profile data retrieved: ", profileData);
      if(profileData){
        // const url = URL.createObjectURL(profileData.profilePicture);  //create a url for the image stored in the memory
        // setImageUrl(url);
      }
    })
    .catch(error => {
      console.log(error);
      
    })
  }, [])


  return (
    <IonPage>
      <IonContent fullscreen>
        <IonContent >
          { profileData ? (
            <div className='profile-container'>
              <div className='profile-contents'>
                {/* <IonImg src={imageUrl} alt=''/> */}
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
          ): (
            <IonLoading isOpen={true} message={"Retrieving profile information.."} />
          )}
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
