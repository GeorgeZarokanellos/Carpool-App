import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonPicker,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useCallback, useState } from "react";
import type { autoMaker } from "../interfacesAndTypes/Types";
import "./DriverVehicleRegistration.scss";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
  const [driversLicense, setDriversLicense] = useState<Blob | null>(null);
  const [driversLicenseFileName, setDriversLicenseFileName] = useState<string>(""); 
  const [vehicleInsurance, setVehicleInsurance] = useState<Blob | null>(null);
  const [vehicleInsuranceFileName, setVehicleInsuranceFileName] = useState<string>("");
  const [vehicleRegistration, setVehicleRegistration] = useState<Blob | null>(null);
  const [vehicleRegistrationFileName, setVehicleRegistrationFileName] = useState<string>("");
  const [vehiclePictures, setVehiclePictures] = useState<Blob[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

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

  const createFileUploadButton = (id: string, fileName: string, setMethod: React.Dispatch<React.SetStateAction<string>>) => {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && e.target.files[0].name !== undefined) {
        console.log(e.target.files[0].name);
        setMethod(e.target.files[0].name);
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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ textAlign: "center" }}> Driver & Vehicle Registration </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="driver-vehicle-registration-container">
          <form
            onSubmit={handleDriverVehicleRegistration}
            className="custom-form"
          >
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
              {createFileUploadButton( "driversLicense", driversLicenseFileName, setDriversLicenseFileName)}
            </div>
            <div className="vehicle-insurance-container">
              {createFileUploadButton( "vehicleInsurance", vehicleInsuranceFileName, setVehicleInsuranceFileName)}
            </div>
            <div className="vehicle-registration-container">
              {createFileUploadButton( "vehicleRegistration", vehicleRegistrationFileName, setVehicleRegistrationFileName)}
            </div>
            <div className="car-images-container">
              <IonButton onClick={() => document.getElementById('vehiclePictures')?.click()}>
                {vehiclePictures.length ? 'Selected images' : 'Upload car images'}
                <input type="file" id="vehiclePictures" hidden multiple accept="image/*" onChange={handleImagesUpload} />
              </IonButton>
              {/* {console.log(imageUrls)} */}
              <Carousel>
                {
                  imageUrls.map((url, index) => (
                    <div key={index}>
                      <img src={url} alt="car" />
                    </div>
                  ))
                }
              </Carousel>
            </div>
            <div className="register-button-container">
              <IonButton expand="full" type="submit" shape="round" className="register-button">
                Register
              </IonButton>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};
