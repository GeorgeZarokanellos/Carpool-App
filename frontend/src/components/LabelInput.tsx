// LabelInput.tsx
import React from 'react';
import { IonLabel, IonInput } from '@ionic/react';
import './LabelInput.scss';
import { LabelInputProps } from '../interfacesAndTypes/Interfaces';

export const LabelInput: React.FC<LabelInputProps> = ({ label, placeholder, name, type, onIonChange }) => {
  return (
    <div className='label-input'>
      <IonLabel>{label}</IonLabel>
      <IonInput 
        type={type}
        placeholder={placeholder}
        name={name}
        autocomplete='new-password'
        onIonChange={onIonChange}
        required
      />
    </div>
  );
};
