import React, { useEffect, useState } from 'react';
import { IonContent, IonIcon, IonImg, IonItem, IonLoading, IonPage} from '@ionic/react';
import './Profile.scss';
import instance from '../AxiosConfig';
import { type ProfileData } from '../interfacesAndTypes/Types';
import { star, starHalf, starOutline } from 'ionicons/icons';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>();
  const [ratingStars, setRatingStars] = useState<JSX.Element[]>([]);
  let rating:number;

  useEffect(() => {
    instance.get(`/profile/${localStorage.getItem('userId')}`)
    .then(response => {
      setProfileData(response.data);
      console.log(profileData);
      if(profileData)
        rating = Number(profileData?.overallRating);
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
        <IonContent>
          <div>
            <IonImg />
            {/* <h1>{profileData.firstName} {profileData.lastName}</h1> */}
            <IonItem lines='none'>
              <div>
                {ratingStars}
              </div>
            </IonItem>
          </div>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
