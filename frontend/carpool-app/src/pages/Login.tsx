import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonLabel } from '@ionic/react';
import './Login.css';
import instance from '../AxiosConfig';
import { useHistory } from 'react-router';

const Login: React.FC = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    // Handle login logic here
    console.log(`Username: ${username}, Password: ${password}`);
    instance.post('/authenticate/login', {
      username: username,
      password: password    
    })
    .then((response) => {
      console.log(response.data);
      
      if(response.status === 200){
        history.push('/main');
      } else if(response.status === 401){
        alert('Invalid credentials');
      }
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" >
        <div className='login-container'>
          <form onSubmit={handleLogin} className='custom-form'>
            <div className='credentials-container'>
              <IonLabel className='custom'> Username </IonLabel>
              <div className='username'>
                  <IonInput 
                      value={username} 
                      class='input-field' 
                      required = {true}
                      mode='md'
                      onIonChange={e => {
                        if (e.detail.value != null) {
                          setUsername(e.detail.value);
                        }
                      }}
                      />
              </div>
              <IonLabel className='custom'> Password </IonLabel>
              <div className='password'>
                  <IonInput 
                      value={password} 
                      type="password" 
                      class='input-field' 
                      required = {true}
                      mode='md'
                      onIonChange={e => {
                        if (e.detail.value != null) {
                          setPassword(e.detail.value);
                        }
                      }}
                  />

              </div>
              <div className='submit-button-container'>
                <IonButton expand="full" type="submit" shape='round' >Login</IonButton>
              </div>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;