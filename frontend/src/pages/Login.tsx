import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonAlert, IonLoading } from '@ionic/react';
import './Login.scss';
import instance from '../AxiosConfig';
import { useHistory } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

interface LoginFormInterface {
  username: string;
  password: string;
} 

const Login: React.FC = () => {

  // const loginRequestValidationSchema = object().shape({
  //   username: string().required('Username is required'),
  //   password: string().required('Password is required')
  // })

  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, formState: {errors}} = useForm<LoginFormInterface>({
    // resolver: yupResolver(loginRequestValidationSchema),
  });
  const history = useHistory();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const handleLogin = async (data : {username: string; password: string;}) => {
    setIsLoading(true);
    await instance.post('/login', {
      username: data.username,
      password: data.password    
    }).then((response) => {
      console.log(response);
      if(response.status === 200 && response.data.message === 'Login successful'){
        const userRole = response.data.role;

        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', userRole);
        localStorage.setItem('token', response.data.token);
        
        if(userRole === 'passenger' || userRole === 'driver'){
          if(response.data.role === 'driver'){
            localStorage.setItem('nextScheduledTripId', response.data.nextScheduledTripId);
          }
          setIsLoading(false);
          history.push('/main/search-trips');
        } else if(userRole === 'admin'){
          setIsLoading(false);
          history.push('/admin/dashboard');
        }
      } else if(response.status === 401 || response.status === 402) {
        setIsLoading(false);
        setShowAlert(true);
      } else {
        setIsLoading(false);
      }
    })
    .catch((error) => {
      if(error.status === 401 || error.status === 402){
        setIsLoading(false);
        setShowAlert(true);
      }
      console.log("Error during login", error);
    });
  }

  return (
    <IonPage style={{ height: `${viewportHeight}`, width: `${viewportWidth}` }}>
      <IonHeader>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" >
        <div className='login-container' >
          <form onSubmit={handleSubmit(handleLogin)} className='custom-form'>
            <div className='credentials-container'>
              <IonLabel className='custom'> Username </IonLabel>
              <div className='username'>
                <Controller 
                  name='username'
                  control={control}
                  render={({field}) => (
                    <IonInput 
                      {...field} 
                      name='username'
                      class='input-field' 
                      required = {true}
                      mode='md'
                      onIonChange={e => {
                        const value = e.target.value;
                        field.onChange(value);
                      }}
                    />
                  )}
                />
                {errors['username'] && <p className='error-message'>{errors['username'].message}</p>}
              </div>
              <IonLabel className='custom'> Password </IonLabel>
              <div className='password'>
                <Controller 
                  name='password'
                  control={control}
                  render={({field}) => (
                    <IonInput 
                      {...field}
                      name='password'
                      type="password" 
                      class='input-field' 
                      required = {true}
                      mode='md'
                      onIonChange={e => {
                        const value = e.target.value;
                        field.onChange(value);
                      }}
                    />
                  )}
                /> 
              {errors['password'] && <p className='error-message'>{errors['password'].message}</p>}
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