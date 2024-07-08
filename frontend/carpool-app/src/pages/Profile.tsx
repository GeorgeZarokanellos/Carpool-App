import React, { useEffect, useState } from 'react';
import { IonContent, IonIcon, IonImg, IonItem, IonLoading, IonPage, IonTitle} from '@ionic/react';
import './Profile.scss';
import instance from '../AxiosConfig';
import { type ProfileData } from '../interfacesAndTypes/Types';
import { star, starHalf, starOutline } from 'ionicons/icons';
import { SubmittedReceivedReviewsDisplay } from '../components/ReviewsDisplay';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>();
  const [ratingStars, setRatingStars] = useState<JSX.Element[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  let rating:number;

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
        rating = Number(profileData.overallRating);
        // const url = URL.createObjectURL(profileData.profilePicture);  //create a url for the image stored in the memory
        // setImageUrl(url);
      }
    })
    .catch(error => {
      console.log(error);
      
    })
  }, [])

  useEffect(() => {
    const icons = [];
    if(rating !== 0) {
      const ratingIntegerPart = Math.floor(rating); 
      const ratingFractionPart = rating - ratingIntegerPart; 
      for(let index = 0; index < ratingIntegerPart; index++){
        icons.push(<IonIcon key={`star_${index}`} icon={star} />);
      }
      if(ratingFractionPart === 0.5){
        icons.push(<IonIcon key="star_half" icon={starHalf} />)
      } else {
        icons.push(<IonIcon key="star_outline" icon={starOutline} />)
      }
      setRatingStars(icons);
    } else if(rating === 0) {
      for(let i = 0; i < 5; i++){
        icons.push(<IonIcon key={`star_outline_${i}`} icon={starOutline} />);
      }
      setRatingStars(icons);
    }
  },[profileData])


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
