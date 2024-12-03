import React from "react";
import { IonMenuButton } from "@ionic/react"

export const MenuButton: React.FC = () => {

    return (
        <IonMenuButton autoHide={false} slot='start'></IonMenuButton>
    )
}