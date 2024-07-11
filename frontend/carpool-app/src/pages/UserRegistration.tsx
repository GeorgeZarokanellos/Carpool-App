import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCheckbox, IonFooter } from '@ionic/react';
import './UserRegistration.scss';
import { LabelInput } from '../components/LabelInput';
import instance from '../AxiosConfig';
import { useHistory } from 'react-router';


export const UserRegistration: React.FC = () => {
  const [universityId, setUniversityId] = useState<number>();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<Blob>();
  const [isDriver, setIsDriver] = useState(false);
//   const [role, setRole] = useState<string>('');  //TODO check if needed
  const history = useHistory();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const userRegistrationRequestBody = {
      universityId: universityId,
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email,
      phone: phone,
      role: (isDriver? 'driver' : 'passenger'),
      profilePicture 
    }

    //loop through the string/number entries of the object and append the the formData var
    Object.entries(userRegistrationRequestBody).forEach(([key, value])=>{
      if(value !== undefined && key !== 'profilePicture'){
        formData.append(`${key}`, value.toString());
      }
    });

    if(userRegistrationRequestBody.profilePicture !== undefined)
      formData.append('profilePicture', userRegistrationRequestBody.profilePicture);
    // Handle registration here
    instance.post('/registration/user', {
      universityId: universityId,
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email,
      phone: phone,
      role: (isDriver? 'driver' : 'passenger')
    }).then((response) => {
      if(isDriver){
        console.log("response",response);
        history.push(`/registration/driver/${response.data.userId}`, {userId: response.data.userId})
      }
      else
        history.push('/');
    }).catch((error) => {
      console.log(error);
    });
    
  };

  return (
    <IonPage style={{width: `${viewportWidth}`, height: `${viewportHeight}`}}>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{textAlign: 'center'}}>Registration</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* <div className='registration-container'> */}
            <form onSubmit={handleRegistration} className='custom-form' encType='multipart/form-data'>
              <div className='form-contents'>
                  <LabelInput label='University ID' value={universityId ?? ''} type='number' onIonChange={value => setUniversityId(Number(value))} />
                  <LabelInput label='First Name' value={firstName} type='text' onIonChange={value => setFirstName(String(value))} />
                  <LabelInput label='Last Name' value={lastName} type='text' onIonChange={value => setLastName(String(value))} />
                  <LabelInput label='Username' value={username} type='text' onIonChange={value => setUsername(String(value))} />
                  <LabelInput label='Password' value={password} type='password' onIonChange={value => setPassword(String(value))} />
                  <LabelInput label='Email' value={email} type='email' onIonChange={value => setEmail(String(value))} />
                  <LabelInput label='Phone' value={phone} type='tel' onIonChange={value => setPhone(String(value))} />
                  <IonCheckbox labelPlacement='stacked' alignment='center' onIonChange={e => setIsDriver(e.detail.checked)}>
                    <span style={{fontSize:'1.3rem'}}>Wanna register as a driver?</span>
                  </IonCheckbox>
              </div>
            </form>
        {/* </div> */}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <div className='register-button-container'>
            <IonButton expand="block" type="submit" >Register</IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};
