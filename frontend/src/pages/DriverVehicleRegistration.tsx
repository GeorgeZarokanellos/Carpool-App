
import {
  IonAlert,
  IonButton,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonPage,
  IonPicker,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useCallback, useState } from "react";
import type { autoMaker } from "../interfacesAndTypes/Types";
import "./DriverVehicleRegistration.scss";
import { Swiper,SwiperSlide } from 'swiper/react';
import 'swiper/css';
import instance from "../AxiosConfig";
import { useHistory } from "react-router";
import { useParams } from 'react-router-dom';
import { object, string } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface DriverVehicleRegistrationRequestBody {
  driversLicenseId: string;
  vehicleNumberPlate: string;
}

export const DriverVehicleRegistration: React.FC = () => {
  //#region states
  const [showMakerPicker, setShowMakerPicker] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showNoOfSeatsPicker, setShowNoOfSeatsPicker] = useState(false);
  const [selectedVehicleMaker, setSelectedVehicleMaker] = useState<autoMaker>({
    maker: "",
    models: [],
  });
  // const [licenseId, setLicenseId] = useState<number | null>(null);
  // const [vehicleNumberPlate, setVehicleNumberPlate] = useState<string | null>(null);
  const [selectedVehicleModel, setSelectedVehicleModel] = useState<string>("");
  const [noOfSeats, setNoOfSeats] = useState<string>('');
  const [driversLicense, setDriversLicense] = useState<Blob>();
  const [driversLicenseFileName, setDriversLicenseFileName] = useState<string>(""); 
  const [vehicleInsurance, setVehicleInsurance] = useState<Blob>();
  const [vehicleInsuranceFileName, setVehicleInsuranceFileName] = useState<string>("");
  const [vehicleRegistration, setVehicleRegistration] = useState<Blob>();
  const [vehicleRegistrationFileName, setVehicleRegistrationFileName] = useState<string>("");
  const [vehicleImages, setVehicleImages] = useState<Blob[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  //alert message
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  //#endregion
  
  const history = useHistory();
  const { userId } = useParams<{userId: string}>();
  //set width and height to the available screen size to bypass header and footer
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const autoMakers = [
    { maker: "Toyota", models: ["Yaris", "Avensis"] },
    { maker: "BMW", models: ["3 series", "1 series"] },
    { maker: "Mercedes", models: ["A class", "C class"] },
    { maker: "Honda", models: ["Civic", "Jazz"] },
    { maker: "Ford", models: ["Focus", "Fiesta"] },
    { maker: "Opel", models: ["Corsa", "Astra"] },
    { maker: "Seat", models: ["Ibiza", "Leon"] },
  ];

  const requestBodyValidationSchema = object().shape({
    driversLicenseId: string().required('Driver\'s license id is required').matches(/^[0-9]{6,15}$/, 'Driver\'s license must be between 6 and 15 digits'),
    vehicleNumberPlate: string().required('Vehicle\'s number plate is required').min(6, 'Vehicle\'s number plate must be at least 6 characters long').max(10, 'Vehicle\'s number plate cannot exceed 10 characters')
  })

  const { control, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(requestBodyValidationSchema),
  });

  const handleDriverVehicleRegistration = async (data: DriverVehicleRegistrationRequestBody) => {

    const formData = new FormData();

    const vehicleAndDriverData = {
      licenseId: data.driversLicenseId,
      plateNumber: data.vehicleNumberPlate,
      maker: selectedVehicleMaker.maker,
      model: selectedVehicleModel,
      noOfSeats: noOfSeats,
      driversLicense: driversLicense,
      vehicleInsurance: vehicleInsurance,
      vehicleRegistration: vehicleRegistration,
      vehicleImages: vehicleImages
    }
    
    Object.entries(vehicleAndDriverData).forEach(([key, value]) => {
      if(value !== undefined && value !== null){  //check if the state is not undefined/empty1
        if(key === 'vehicleImages' && Array.isArray(value)){ 
          // console.log("vehicle images is an array",key);
          value.forEach((file) => {  //if its an array of pictures loop through it and append each picture
            formData.append(`${key}`, file);
          });
        } else if (value instanceof Blob ) //if value is a single blob append it straight away
          formData.append(`${key}`, value);
        else 
          formData.append(`${key}`, value.toString());
      }
    });
    console.log("form data: ",formData);
    
    await instance.post(`registration/driver/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer your_token_here'
      }
    })
    .then(response => {
      console.log("From driver multipart post request", response.data);
      setAlertMessage("Driver and vehicle registration successful");
      setShowAlert(true);
    })
    .catch(error => {
      console.log("Error from driver multipart request", error);
      setErrorMessage("Driver and vehicle registration failed. Check your inputs and try again");
      setShowErrorAlert(true);
    })
  }

  const createFileUploadButton = (id: string, 
                                  fileName: string, 
                                  inputName: string,
                                  setFileMethod: React.Dispatch<React.SetStateAction<Blob | undefined>>, 
                                  setNameMethod: React.Dispatch<React.SetStateAction<string>>,
                                  ) => {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]?.name !== undefined) {
        setFileMethod(e.target.files[0]);
        setNameMethod(e.target.files[0].name);
      }
    }
    //regular expression to split the id string in the first capital letter and then join the array with a space
    const displayedName = fileName ? fileName : id.split(/(?=[A-Z])/).join(' ') + '(PDF)';
    return (
      <IonButton onClick={() => document.getElementById(id)?.click()}>
        {displayedName}
        <input type="file" id={id} name={inputName} hidden required accept=".pdf" onChange={handleFileUpload} />
      </IonButton>
    )
  }

  const handleImagesUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const files = Array.from(e.target.files);
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setVehicleImages(prevPictures => [...prevPictures, ...files]);
      setImageUrls(prevUrls => [...prevUrls, ...newUrls]);
    }
  }, []);

  return (
    <IonPage style={{width: `${viewportWidth}`, height: `${viewportHeight}`}}>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ textAlign: "center" }}>
            <div style={{whiteSpace: "normal"}}>
              Driver & Vehicle Registration 
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow className="filler"/>
          <IonRow>
            <form
            onSubmit={handleSubmit(handleDriverVehicleRegistration)}
              className="custom-form"
              encType="multipart/form-data"
            >
              <div className="form-contents">
                <div className="licenseId-container">
                  <Controller 
                    name='driversLicenseId'
                    control={control}
                    render={({field}) => (
                      <input 
                        name="driversLicenseId" 
                        type="number" 
                        placeholder="DRIVERS LICENSE ID" 
                        required 
                        value={field.value !== null ? field.value : ''} 
                        onChange={(e) => {
                          const value = e.target.value ? parseInt(e.target.value) : null;
                          field.onChange(value);
                        }}/>  
                    )}
                  />
                  {errors['driversLicenseId'] !== undefined && <p className="error-message">{errors['driversLicenseId']?.message}</p>}
                </div>
                <div className="plate-number-container">
                  <Controller 
                    name="vehicleNumberPlate"
                    control={control}
                    render={({field}) => (
                      <input 
                        name="vehicleNumberPlate"
                        type="text" 
                        placeholder="VEHICLE NUMBER PLATE" 
                        required 
                        value={field.value !== null ? field.value : ''} 
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                        }}
                      />
                    )}
                    />
                  {errors['vehicleNumberPlate'] !== undefined && <p className="error-message">{errors['vehicleNumberPlate']?.message}</p>}
                </div>
                <div className="pickers">
                    <IonButton onClick={() => setShowMakerPicker(true)}>
                    {
                      selectedVehicleMaker.maker && selectedVehicleModel 
                      ? (
                          //TODO different orientation to look better?
                          <>  
                            <p style={{margin: 0}}>Selected vehicle
                              <br />
                              {selectedVehicleMaker.maker} {selectedVehicleModel}
                            </p>
                          </>
                        ) 
                        : 'Select Maker and Model'
                    }
                    </IonButton>
                    {showMakerPicker && (
                      <IonPicker
                        isOpen={showMakerPicker}
                        columns={[
                          {
                            name: "Car Maker",
                            options: autoMakers.map((autoMaker, index) => ({
                              text: autoMaker.maker,
                              value: index,
                            })),
                          },
                        ]}
                        buttons={[
                          {
                            text: "Cancel",
                            role: "Cancel",
                            handler: () => setShowMakerPicker(false),
                          },
                          {
                            text: "Confirm",
                            handler: (value) => {
                              setSelectedVehicleMaker(
                                autoMakers[value["Car Maker"].value]
                              );
                              setShowMakerPicker(false);
                              setShowModelPicker(true);
                            },
                          },
                        ]}
                      />
                    )}
                    {showModelPicker && (
                      <IonPicker
                        isOpen={showModelPicker}
                        columns={[
                          {
                            name: "Model",
                            options: selectedVehicleMaker.models.map(
                              (model, index) => ({
                                text: model,
                                value: index,
                              })
                            ),
                          },
                        ]}
                        buttons={[
                          {
                            text: "Back to Maker",
                            role: "Back",
                            handler: () => {
                              setShowMakerPicker(true);
                              setShowModelPicker(false);
                            },
                          },
                          {
                            text: "Confirm",
                            handler: (value) => {
                              setSelectedVehicleModel(value["Model"].text);
                              setShowModelPicker(false);
                            },
                          },
                        ]}
                      />
                    )}
                </div>
                <div className="no-of-seats-container"> 
                  <IonButton onClick={() => setShowNoOfSeatsPicker(true)}>
                    {noOfSeats ? 'Available seats: ' + noOfSeats : "Select number of seats"}
                  </IonButton>
                  <IonPicker 
                    isOpen={showNoOfSeatsPicker}
                    columns={[
                      {
                        name: 'Seats',
                        options: [
                          { text: '1', value: 1 },
                          { text: '2', value: 2 },
                          { text: '3', value: 3 },
                          { text: '4', value: 4 },
                          { text: '5', value: 5 }
                        ]
                      }
                    ]}
                    buttons={[
                      {
                        text: 'Cancel',
                        role: 'Cancel',
                        handler: () => setShowNoOfSeatsPicker(false)
                      },
                      {
                        text: 'Confirm',
                        handler: (value) => {
                          setNoOfSeats(value.Seats.value);
                          setShowNoOfSeatsPicker(false);
                        }
                      }
                    ]}
                  />
                </div>
                <div className="drivers-license-container">
                  {createFileUploadButton( "DriversLicense", driversLicenseFileName, "driversLicense" , setDriversLicense , setDriversLicenseFileName)}
                </div>
                <div className="vehicle-insurance-container">
                  {createFileUploadButton( "VehicleInsurance", vehicleInsuranceFileName, "vehicleInsurance" , setVehicleInsurance, setVehicleInsuranceFileName)}
                </div>
                <div className="vehicle-registration-container">
                  {createFileUploadButton( "VehicleRegistration", vehicleRegistrationFileName, "vehicleRegistration" , setVehicleRegistration, setVehicleRegistrationFileName)}
                </div>
                <div className="car-images-container">
                  <IonButton onClick={() => document.getElementById('vehicleImages')?.click()}>
                    {vehicleImages.length ? 'Selected images' : 'Upload car images(JPEG/PNG)'}
                    <input type="file" id="vehicleImages" name="vehicleImages" hidden required multiple accept="image/jpeg, image/png" onChange={handleImagesUpload} />
                  </IonButton>
                  <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                  >
                    {
                      imageUrls.map((url, index) => (
                        <SwiperSlide key={index}>
                          <img src={url} alt="car" />
                        </SwiperSlide>
                      ))
                    }
                  </Swiper>
                </div>
              </div>
            </form>
          </IonRow>
          <IonRow className="filler"/>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <div className="register-button-container">
            <IonButton className="register-button" expand="block" onClick={handleSubmit(handleDriverVehicleRegistration)} >
              Submit
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
      <IonAlert 
        isOpen={showAlert}
        onDidDismiss={() => {
          setShowAlert(false);
          history.push('/main/search-trips');
        }}
        header={'Registration status'}
        message={alertMessage}
        buttons={['OK']}
      />
      <IonAlert 
        isOpen={showErrorAlert}
        onDidDismiss={() => {
          setShowErrorAlert(false);
          setErrorMessage('');
        }}
        header={'Error'}
        message={errorMessage}
        buttons={['OK']}
      />
    </IonPage>
  )
};
