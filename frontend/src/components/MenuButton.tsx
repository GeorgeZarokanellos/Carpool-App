import React from "react";
import { IonMenuButton, IonToolbar } from "@ionic/react"

export const MenuButton: React.FC = () => {

    return (
        <IonToolbar style={{width: '10%'}}>
            <IonMenuButton autoHide={false} slot='start'></IonMenuButton>
        </IonToolbar>
    )
}