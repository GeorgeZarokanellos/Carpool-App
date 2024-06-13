import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonPage,
  IonPicker,
  IonRange,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";
import type { autoMaker } from "../interfacesAndTypes/Types";
import { LabelInput } from "../components/LabelInput";
import "./DriverVehicleRegistration.scss";

export const DriverVehicleRegistration: React.FC = () => {
  const [showMakerPicker, setShowMakerPicker] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [selectedVehicleMaker, setSelectedVehicleMaker] = useState<autoMaker>({
    maker: "",
    models: [],
  });
  const [selectedVehicleModel, setSelectedVehicleModel] = useState<string>("");
  const [noOfSeats, setNoOfSeats] = useState<number>();
  const [driversLicense, setDriversLicense] = useState<Blob | null>(null);
  const [vehicleInsurance, setVehicleInsurance] = useState<Blob | null>(null);
  const [vehicleRegistration, setVehicleRegistration] = useState<Blob | null>(
    null
  );
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
              <div className="maker-picker">
                <IonButton onClick={() => setShowMakerPicker(true)}>
                {
                  selectedVehicleMaker.maker && selectedVehicleModel 
                  ? (
                      //TODO increase the gap between the two lines
                      <>  
                        <p>Selected vehicle
                          <br />
                        {selectedVehicleMaker.maker} {selectedVehicleModel}</p>
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
              </div>
              <div className="model-picker">
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
            </div>
            <div className="no-of-seats-container"> 
              <IonInput 
                type="number"
                value={noOfSeats}
                placeholder="Number of available seats"
                min={1}
                max={5}
                shape="round"
                onIonChange={(e) => setNoOfSeats(Number(e.detail.value!))}  
              >
              </IonInput>
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
