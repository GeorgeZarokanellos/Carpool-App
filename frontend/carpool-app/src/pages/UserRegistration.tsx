import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonCheckbox } from '@ionic/react';
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
  const [isDriver, setIsDriver] = useState(false);
//   const [role, setRole] = useState<string>('');  //TODO check if needed
  const history = useHistory();


  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
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
    })

    history.push('/login');
    
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{textAlign: 'center'}}>Registration</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className='registration-container'>
            <form onSubmit={handleRegistration} className='custom-form'>
              <div className='credentials-container'>
                  <LabelInput label='University ID' value={universityId ?? ''} type='number' onIonChange={value => setUniversityId(Number(value))} />
                  <LabelInput label='First Name' value={firstName} type='text' onIonChange={value => setFirstName(String(value))} />
                  <LabelInput label='Last Name' value={lastName} type='text' onIonChange={value => setLastName(String(value))} />
                  <LabelInput label='Username' value={username} type='text' onIonChange={value => setUsername(String(value))} />
                  <LabelInput label='Password' value={password} type='password' onIonChange={value => setPassword(String(value))} />
                  <LabelInput label='Email' value={email} type='email' onIonChange={value => setEmail(String(value))} />
                  <LabelInput label='Phone' value={phone} type='tel' onIonChange={value => setPhone(String(value))} />
                  <IonButton expand="full" type="submit" shape='round'>Register</IonButton>
                  <IonCheckbox labelPlacement='stacked' alignment='center' onIonChange={e => setIsDriver(e.detail.checked)}>
                    Wanna register as a driver?
                  </IonCheckbox>
              </div>
            </form>
        </div>
      </IonContent>
    </IonPage>
  );
};
