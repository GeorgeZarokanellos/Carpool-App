import { IonContent, IonHeader, IonPage, IonText, IonTitle } from "@ionic/react";
import React, {useEffect, useState } from "react";
import './NotificationPage.scss';
import { NotificationDisplay } from "../components/NotificationDisplay";
import { NotificationInterface } from "../interfacesAndTypes/Interfaces";
import { MenuButton } from "../components/MenuButton";

interface NotificationPageProps {
    notifications: NotificationInterface[];
}

export const NotificationPage:React.FC<NotificationPageProps> = ({ notifications}) => {
    const [filteredNotifications, setFilteredNotifications] = useState<NotificationInterface[]>([]);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const tempFilteredNotifications: NotificationInterface[] = [];

        //filter notifications based on user role
        notifications.forEach( (notification) => {
            if(notification.driverId === Number(userId) && notification.recipient === 'driver') {
                tempFilteredNotifications.push(notification);                
            } else if(notification.passengerId === Number(userId) && notification.recipient === 'passenger') {
                tempFilteredNotifications.push(notification);
            }
        });

        setFilteredNotifications(tempFilteredNotifications);
    }, [notifications]);
        
    return (
        <IonPage style={{height: `${viewportHeight}`, width: `${viewportWidth}`}}>
            <IonHeader>
                <MenuButton/>
                <IonTitle  style={{color: 'black'}}>Notifications</IonTitle>
            </IonHeader>
            <IonContent>
                {
                    filteredNotifications.length !== 0 ? 
                        (
                            filteredNotifications.map((notification, index)=> {
                                return (
                                    <NotificationDisplay key={index} notificationDetails={notification}/>
                                )
                            }
                        )
                    ) : (
                        <div className="no-notifications">
                            <IonText class='ion-text-center'>No new notifications at the moment.<br />Come back later!</IonText>
                        </div>
                    )
                }
            </IonContent>
        </IonPage>
    );
}