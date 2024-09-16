// LabelInput.tsx
import React from 'react';
import { IonLabel, IonInput } from '@ionic/react';
import './LabelInput.scss';
import { LabelInputProps } from '../interfacesAndTypes/Interfaces';

export const LabelInput: React.FC<LabelInputProps<string | number>> = ({ label, placeholder, value, type, onIonChange }) => {
  return (
    <div className='label-input'>
      <IonLabel>{label}</IonLabel>
      <IonInput 
        value={value}
        type={type}
        placeholder={placeholder}
        autocomplete='new-password'
        onIonChange={e => {
          if (e.detail.value != undefined) {
            onIonChange(e.detail.value as string | number);
          }
        }}

      />
    </div>
  );
};
