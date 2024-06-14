//TODO fix the problem with the carousel display

import {
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

export const DriverVehicleRegistration: React.FC = () => {
  const [showMakerPicker, setShowMakerPicker] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showNoOfSeatsPicker, setShowNoOfSeatsPicker] = useState(false);
  const [selectedVehicleMaker, setSelectedVehicleMaker] = useState<autoMaker>({
    maker: "",
    models: [],
  });
  const [selectedVehicleModel, setSelectedVehicleModel] = useState<string>("");
  const [noOfSeats, setNoOfSeats] = useState<number>();
  const [driversLicense, setDriversLicense] = useState<Blob>();
  const [driversLicenseFileName, setDriversLicenseFileName] = useState<string>(""); 
  const [vehicleInsurance, setVehicleInsurance] = useState<Blob>();
  const [vehicleInsuranceFileName, setVehicleInsuranceFileName] = useState<string>("");
  const [vehicleRegistration, setVehicleRegistration] = useState<Blob>();
  const [vehicleRegistrationFileName, setVehicleRegistrationFileName] = useState<string>("");
  const [vehiclePictures, setVehiclePictures] = useState<Blob[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

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

  const handleDriverVehicleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const createFileUploadButton = (id: string, 
                                  fileName: string, 
                                  setFileMethod: React.Dispatch<React.SetStateAction<Blob | undefined>>, 
                                  setNameMethod: React.Dispatch<React.SetStateAction<string>>) => {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]?.name !== undefined) {
        console.log(e.target.files[0]);
        // console.log(e.target.files[0].name);
        setFileMethod(e.target.files[0]);
        setNameMethod(e.target.files[0].name);
      }
    }
    const displayedName = fileName ? fileName : id.split(/(?=[A-Z])/).join(' ');
    return (
      <IonButton onClick={() => document.getElementById(id)?.click()}>
        {displayedName}
        <input type="file" id={id} hidden accept=".pdf" onChange={handleFileUpload}/>
      </IonButton>
    )
  }

  const handleImagesUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const files = Array.from(e.target.files);
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setVehiclePictures(prevPictures => [...prevPictures, ...files]);
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
              onSubmit={handleDriverVehicleRegistration}
              className="custom-form"
            >
              <div className="form-contents">
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
                              console.log(
                                "selected automaker before set:",
                                value["Car Maker"]
                              );

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
                              console.log("selected model:", value["Model"].text);
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
                          // console.log(value.Seats.value);
                          setNoOfSeats(value.Seats.value);
                          setShowNoOfSeatsPicker(false);
                        }
                      }
                    ]}
                  />
                </div>
                <div className="drivers-license-container">
                  {createFileUploadButton( "driversLicense", driversLicenseFileName, setDriversLicense , setDriversLicenseFileName)}
                </div>
                <div className="vehicle-insurance-container">
                  {createFileUploadButton( "vehicleInsurance", vehicleInsuranceFileName, setVehicleInsurance, setVehicleInsuranceFileName)}
                </div>
                <div className="vehicle-registration-container">
                  {createFileUploadButton( "vehicleRegistration", vehicleRegistrationFileName, setVehicleRegistration, setVehicleRegistrationFileName)}
                </div>
                <div className="car-images-container">
                  <IonButton onClick={() => document.getElementById('vehiclePictures')?.click()}>
                    {vehiclePictures.length ? 'Selected images' : 'Upload car images'}
                    <input type="file" id="vehiclePictures" hidden multiple accept="image/*" onChange={handleImagesUpload} />
                  </IonButton>
                  <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    onSlideChange={() => console.log('slide change')}
                  >
                    {imageUrls.map((url, index) => (
                      <SwiperSlide key={index}>
                        <img src={url} alt="car" />
                      </SwiperSlide>
                    ))}
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
            <IonButton className="register-button" expand="block" onClick={handleDriverVehicleRegistration}>
              Submit
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};
