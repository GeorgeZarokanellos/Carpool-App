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
import React, { useState } from "react";
import type { autoMaker } from "../interfacesAndTypes/Types";
import "./DriverVehicleRegistration.scss";

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
  const [vehicleInsurance, setVehicleInsurance] = useState<Blob | null>(null);
  const [vehicleRegistration, setVehicleRegistration] = useState<Blob | null>(null);
  const [vehiclePictures, setVehiclePictures] = useState<Blob[]>([]);

  const autoMakers = [
    { maker: "Toyota", models: ["Yaris", "Avensis"] },
    { maker: "BMW", models: ["3 series", "1 series"] },
    { maker: "Mercedes", models: ["A class", "C class"] },
    { maker: "Honda", models: ["Civic", "Jazz"] },
    { maker: "Ford", models: ["Focus", "Fiesta"] },
    { maker: "Opel", models: ["Corsa", "Astra"] },
    { maker: "Seat", models: ["Ibiza", "Leon"] },
  ];
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file  = e.target.files?.[0];
    if(file) {
      console.log(file);
    }
  }

  const handleDriverVehicleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ textAlign: "center" }}> Registration </IonTitle>
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
                {noOfSeats ? 'Available seats: ' + noOfSeats : "Number of seats"}
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
            <div className="driver-vehicle-files">
              <IonButton onClick={() => document.getElementById('driversLicense')?.click()}>
                Drivers License
                <input type="file" id="driversLicense" hidden accept=".pdf" onChange={handleFileUpload}/>
              </IonButton>

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
