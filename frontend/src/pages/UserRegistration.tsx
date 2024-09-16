import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCheckbox, IonFooter, IonAvatar, IonAlert } from '@ionic/react';
import './UserRegistration.scss';
import { LabelInput } from '../components/LabelInput';
import instance from '../AxiosConfig';
import { useHistory } from 'react-router';
//TODO add tooltip for profile image

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
  //alerts
  const [showUserCreationAlert, setShowUserCreationAlert] = useState(false);
  const [userCreationMessage, setUserCreationMessage] = useState('');
  const [showDriverCreationAlert, setShowDriverCreationAlert] = useState(false);
  const [driverCreationMessage, setDriverCreationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorAlert, setErrorAlert] = useState(false);
  const [userId, setUserId] = useState<number>();
  // const [isLoading, setIsLoading] = useState(false);
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

    console.log("user registration request body", userRegistrationRequestBody);
    

    //loop through the string/number entries of the object and append the the formData var
    Object.entries(userRegistrationRequestBody).forEach(([key, value])=>{
      if(value !== undefined && key !== 'profilePicture'){
        formData.append(`${key}`, value.toString());
      }
    });

    if(userRegistrationRequestBody.profilePicture !== undefined)
      formData.append('profilePicture', userRegistrationRequestBody.profilePicture);

    instance.post('/registration/user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer your_token_here'
      }
    }).then((response) => {
      if(isDriver){
        console.log("response",response);
        setUserId(response.data.userId);
        setDriverCreationMessage('You have successfully registered as a user. Please fill out the driver registration form.');
        // setIsLoading(true);
      }
      else{
        setUserCreationMessage('You have successfully registered as a user. Please log in.');
        setShowUserCreationAlert(true);
      }
    }).catch((error) => {
      console.log(error);
      setErrorMessage('An error occurred while registering. Please try again.' + error.message);
      setErrorAlert(true);
    });
    
  };

  useEffect(() => {
    if(userId !== undefined){
      // setIsLoading(false);
      setShowDriverCreationAlert(true);
    } 
  }, [userId]);

  return (
    <IonPage style={{width: `${viewportWidth}`, height: `${viewportHeight}`}}>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{textAlign: 'center'}}>Registration</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* <div className='registration-container'> */}
            <form onSubmit={handleRegistration} id='userCredentials' className='custom-form' encType='multipart/form-data'>
              <div className='form-contents'>
                  <div className='profile-picture-container'>
                    {/* <IonLabel>Insert profile <br /> picture below</IonLabel> */}
                    <IonButton fill='clear' onClick={() => document.getElementById('profilePicture')?.click()}>
                        <IonAvatar >
                          <img alt="Silhouette of a person's head" src={profilePicture? URL.createObjectURL(profilePicture) : "https://ionicframework.com/docs/img/demos/avatar.svg" }/>
                        </IonAvatar>
                      <input type='file' id='profilePicture' hidden required accept='image/*' onChange={e => setProfilePicture(e.target.files?.[0])} />
                    </IonButton>
                  </div>  
                  <LabelInput label='University ID' placeholder='12 digit registration number' value={universityId ?? ''} type='number' onIonChange={value => setUniversityId(Number(value))} />
                  <LabelInput label='First Name' placeholder='' value={firstName} type='text' onIonChange={value => setFirstName(String(value))} />
                  <LabelInput label='Last Name' placeholder='' value={lastName} type='text' onIonChange={value => setLastName(String(value))} />
                  <LabelInput label='Username' placeholder='' value={username} type='text' onIonChange={value => setUsername(String(value))} />
                  <LabelInput label='Password' placeholder='' value={password} type='password' onIonChange={value => setPassword(String(value))} />
                  <LabelInput label='Email' placeholder='example@gmail.com' value={email} type='email' onIonChange={value => setEmail(String(value))} />
                  <LabelInput label='Phone' placeholder='10 digit personal number' value={phone} type='tel' onIonChange={value => setPhone(String(value))} />
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
            <IonButton form='userCredentials' expand="block" type="submit" shape='round'>Submit</IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
      <IonAlert 
        isOpen={showUserCreationAlert} 
        onDidDismiss={() => {
          setShowUserCreationAlert(false);
          history.push('/');
        }}
        header={'User Registration'} 
        message={userCreationMessage} 
        buttons={['OK']}
      />
      <IonAlert 
        isOpen={showDriverCreationAlert} 
        onDidDismiss={() => {
          setShowDriverCreationAlert(false);
          if(userId !== undefined)
            history.push(`/registration/driver/${userId}`);
          else 
            history.goBack();

        }}
        header={'Driver Registration'} 
        message={driverCreationMessage} 
        buttons={['OK']}
      />
      <IonAlert 
        isOpen={errorAlert} 
        onDidDismiss={() => {
          setErrorAlert(false);
        }}
        header={'Error'} 
        message={errorMessage} 
        buttons={['OK']}
      />
    </IonPage>
  );
};
