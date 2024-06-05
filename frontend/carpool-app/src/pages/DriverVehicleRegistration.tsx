import { IonButton, IonCheckbox, IonContent, IonHeader, IonPage, IonPicker, IonTitle, IonToolbar } from "@ionic/react";
import React, { useState } from "react";
import { LabelInput } from "../components/LabelInput";

export const DriverVehicleRegistration: React.FC = () => {
    const [showPicker, setShowPicker] = useState(false);
    const [selectedVehicleMaker, setSelectedVehicleMaker] = useState<string[]>([]);
    const [noOfSeats, setNoOfSeats] = useState<number>(0);
    const [driversLicense, setDriversLicense] = useState<Blob | null>(null);
    const [vehicleInsurance, setVehicleInsurance] = useState<Blob | null>(null);
    const [vehicleRegistration, setVehicleRegistration] = useState<Blob | null>(null);
    const [vehiclePictures, setVehiclePictures] = useState<Blob[]>([]);

    const autoMakers = [
        {maker: 'Toyota', models: ['Yaris', 'Avensis']}, 
        {maker: 'BMW', models: ['3 series', '1 series']}, 
        {maker: 'Mercedes', models: ['A class', 'C class']}, 
        {maker: 'Honda', models: ['Civic', 'Jazz']}, 
        {maker: 'Ford', models: ['Focus', 'Fiesta']}, 
        {maker: 'Opel', models: ['Corsa', 'Astra']}, 
        {maker: 'Seat', models: ['Ibiza', 'Leon']}, 
    ];

    const handleDriverVehicleRegistration = (e: React.FormEvent) => {
        e.preventDefault();
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
                    <form onSubmit={handleDriverVehicleRegistration} className='custom-form'>
                      <div className='maker-picker'>
                        <IonButton onClick={() => setShowPicker(true)}>Select Car Maker</IonButton>
                        {showPicker && (
                            <IonPicker 
                                isOpen={showPicker}
                                columns={[
                                    {
                                        name: 'Car Maker',
                                        options: autoMakers.map((autoMaker, index) => ({
                                            text: autoMaker.maker, 
                                            value: index
                                        }))
                                    }
                                ]}
                                buttons={[
                                    {
                                        text: cancel
                                    }
                                ]}
                            />
                        )}
                        <IonButton expand="full" type="submit" shape='round'>Register</IonButton>
                      </div>
                    </form>
                </div>
            </IonContent>
        </IonPage>
    );
}  