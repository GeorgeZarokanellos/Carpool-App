import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonAlert, IonLoading } from '@ionic/react';
import './Login.scss';
import instance from '../AxiosConfig';
import { useHistory } from 'react-router';

const Login: React.FC = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bothStatesUpdated, setBothStatesUpdated] = useState(false);
  const history = useHistory();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    setIsLoading(true);
  };

  useEffect(() => {
    const login = async () => {
      if(username && password){
        setBothStatesUpdated(true);
      }
      if(bothStatesUpdated){
        try {
          const response = await instance.post('/login', {
            username: username,
            password: password    
          });
          console.log(response);
          
          if(response && response.data.message === 'Login successful'){
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('token', response.data.token);
            setIsLoading(false);
            history.push('/main/search-trips');
          } else {
            setIsLoading(false);
            setShowAlert(true);
          }
        } catch (error) {
          console.log("An error occurred during login", error);
          setIsLoading(false);
        }
      }
    }
    login();
  }, [bothStatesUpdated, username, password]);

  return (
    <IonPage style={{ height: `${viewportHeight}`, width: `${viewportWidth}` }}>
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
              <div className='register-button-container'>
                <IonLabel className='custom'>Don&apos;t have an account?</IonLabel>
                <IonButton expand="full" shape='round' onClick={() => history.push('/registration')}>Register</IonButton>
              </div>
              <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                className='custom-alert'
                header={'Alert'}
                message={'Invalid username or password!'}
                buttons={['OK']}
                animated={true}
              />
            </div>
          </form>
        </div>
      </IonContent>
      <IonLoading
        isOpen={isLoading}
        message={'Please wait...'}
      />
    </IonPage>
  );
};

export default Login;