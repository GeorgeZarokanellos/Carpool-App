import { IonButton, IonContent, IonPage } from "@ionic/react"
import React, { useState } from "react";
import './AdminDashboard.scss';
import { Statistics } from "./Statistics";
import { Users } from "./Users";
import { Coupons } from "./Coupons";

export const AdminDashboard: React.FC = () => {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    const [activeComponent, setActiveComponent] = useState(<Statistics />);
    return(
        <IonPage style={{height: `${screenHeight}`, width: `${screenWidth}`}}>
            <IonContent >
                <div className="dashboard-container">
                    <div className="side-menu">
                        <div className="options">
                            <ul className="list">
                                <li>
                                    <IonButton onClick={() => setActiveComponent(<Statistics />)}>Statistics</IonButton>
                                </li>
                                <li>
                                    <IonButton onClick={() => setActiveComponent(<Users />)}>Users</IonButton>
                                </li>
                                <li>
                                    <IonButton onClick={() => setActiveComponent(<Coupons />)}>Coupons</IonButton>
                                </li>
                            </ul>
                            
                        </div>
                    </div>
                    <div className="main-menu">
                        {activeComponent}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}