import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCheckbox, IonFooter, IonAvatar, IonAlert, IonLoading } from '@ionic/react';
import './UserRegistration.scss';
import { LabelInput } from '../components/LabelInput';
import instance from '../AxiosConfig';
import { useHistory } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { TextFieldTypes } from '../interfacesAndTypes/Types';
import { mixed, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

//TODO add tooltip for profile image

type inputLabelNames = "universityId" | "firstName" | "lastName" | "username" | "password" | "email" | "phone";
interface UserRegistrationBody {
  universityId: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  role?: string;
  profilePicture: Blob;
}

export const UserRegistration: React.FC = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const requestBodyValidationSchema = object().shape({
    universityId: string().required('University ID is required').matches(/^[0-9]{7}$/, 'University Id needs to be exactly 7 characters long'),
    firstName: string().required('First name is required').max(50, 'First name cannot exceed 50 characters'),
    lastName: string().required('Last name is required').max(50, 'Last name cannot exceed 50 characters'),
    username: string().required('Username is required').max(50, 'Username cannot exceed 50 characters'),
    password: string().required('Password is required').min(3, 'Password cant be less than 3 characters').max(20, 'Password cannot exceed 20 characters').matches(/^[0-9A-Za-z!@#$%^&*_+]{3,20}$/, 'Password must be between 8 and 20 characters long'),
    email: string().required('Email is required').matches(/^[0-9A-Za-z._+]+@[0-9A-Za-z]+\.[a-zA-Z]{2,}$/, 'Email is invalid'),
    phone: string().required('Phone number is required').matches(/^\d{10}$/, 'Phone number must be 10 digits long'),
    profilePicture: 
    mixed<Blob>().
    required('Profile picture is required')
    .test('Is valid type', 'Image type is not valid', (value) => {
      return value && ['image/jpeg', 'image/jpg', 'image/png'].includes((value as Blob).type);
    })
    .test('Filesize', 'The file is too large', (value) => {
      return value && (value as Blob).size <= 5000000;  //in bytes
    })
  });
  const { control, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(requestBodyValidationSchema),
  });

  const handleRegistration = async (data: UserRegistrationBody) => {
    setIsLoading(true);
    const formData = new FormData();
    const userRegistrationRequestBody = {
      universityId: data.universityId,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      password: data.password,
      email: data.email,
      phone: data.phone,
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
        setIsLoading(false);
      }
      else{
        setUserCreationMessage('You have successfully registered as a user. Please log in.');
        setShowUserCreationAlert(true);
        setIsLoading(false);
      }
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
      setErrorMessage('An error occurred while registering. Please try again.');
      setErrorAlert(true);
    });
    
  };

  const inputFieldProperties: { label: string, type: TextFieldTypes, placeholder?: string, name: inputLabelNames}[] = [
    { label: 'University ID', type: 'number' as TextFieldTypes, placeholder: '12 digit registration number', name: 'universityId' },
    { label: 'First Name',  type: 'text' as TextFieldTypes, name: "firstName"},
    { label: 'Last Name', type: 'text' as TextFieldTypes, name: 'lastName'},
    { label: 'Username', type: 'text' as TextFieldTypes, name: 'username'},
    { label: 'Password', type: 'password' as TextFieldTypes, name: 'password'},
    { label: 'Email', type: 'email' as TextFieldTypes, placeholder: 'example@gmail.com' , name: 'email'},
    { label: 'Phone',  type: 'tel' as TextFieldTypes, placeholder: '10 digit personal number' , name: 'phone'},
  ];

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
      <IonContent >
        {/* <div className='user-registration-container'> */}
            <form onSubmit={handleSubmit(handleRegistration)} id='userCredentials' className='custom-form' encType='multipart/form-data'>
              <div className='form-contents'>
                  <div className='profile-picture-container'>
                    {/* <IonLabel>Insert profile <br /> picture below</IonLabel> */}
                    <Controller
                      name='profilePicture'
                      control={control}
                      render={({field}) => (
                        <IonButton fill='clear' onClick={() => document.getElementById('profilePicture')?.click()}>
                            <IonAvatar >
                              <img alt="Silhouette of a person's head" src={profilePicture? URL.createObjectURL(profilePicture) : "https://ionicframework.com/docs/img/demos/avatar.svg" }/>
                            </IonAvatar>
                          <input 
                            type='file' 
                            id='profilePicture' 
                            hidden 
                            accept='image/*' 
                            onChange={e => {
                              const file = e.target.files?.[0] || null;
                              setProfilePicture(e.target.files?.[0]);
                              field.onChange(file); //to update the form state managed by the react hook form 
                            }} />
                        </IonButton>
                      )}
                    />
                    {errors['profilePicture'] !== undefined && <p className='error-message'>{errors['profilePicture']?.message}</p>}
                  </div>  
                  {
                    inputFieldProperties.map((input_field, index) => {
                      return (
                        <div key={index} className='controlled-input-field'>
                            <Controller 
                              name={input_field.name}
                              control={control}
                              render={({ field: {onChange, name} }) => (
                                <LabelInput 
                                  label={input_field.label}
                                  placeholder={input_field.placeholder}
                                  name={name}
                                  type={input_field.type}
                                  onIonChange={onChange}
                                />
                              )}
                            />
                            {errors[input_field.name] != undefined && <p className='error-message'>{errors[input_field.name]?.message}</p>}
                        </div>
                      )
                    })
                  }
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
      <IonLoading 
        isOpen={isLoading}
        message={'Please wait while the information you provided is being processed...'}
      />
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
