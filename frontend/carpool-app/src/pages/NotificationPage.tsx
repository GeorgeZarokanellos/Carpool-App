import { IonContent, IonHeader, IonPage, IonTitle } from "@ionic/react";
import React, { useEffect, useState } from "react";
import instance from "../AxiosConfig";
import './NotificationPage.scss';
import { NotificationDisplay } from "../components/NotificationDisplay";
import { NotificationInterface } from "../interfacesAndTypes/Interfaces";


export const NotificationPage:React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationInterface[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<NotificationInterface[]>([]);

    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');
    let queryParams = new URLSearchParams();
    if(userId !== null && userRole !== null) {
        queryParams = new URLSearchParams({
            userRole
        });
    }

    useEffect(() => {
        retrieveNotifications();
    }, []);

    useEffect(() => {
        notifications.forEach( (notification) => {
            
            if(notification.driverId === Number(userId) && notification.recipient === 'driver') {
                setFilteredNotifications([...filteredNotifications, notification]);
            } else if(notification.passengerId === Number(userId) && notification.recipient === 'passenger') {
                setFilteredNotifications([...filteredNotifications, notification]);
            }
        });
    }, [notifications]);

    useEffect(() => {
        if(filteredNotifications)
            console.log("Filtered Notifications", filteredNotifications);
    }, [filteredNotifications]);

    const retrieveNotifications = async () => {

        try {
            console.log(`/notifications/${userId}?${queryParams.toString()}`);
            const response = await instance.get(`/notifications/${userId}?${queryParams.toString()}`);
            console.log(response.data);
            setNotifications(response.data);
        } catch (error) {
            console.log("Error retrieving notifications", error);
        }

    }

    return (
        <IonPage>
            <IonHeader>
                <IonTitle class='ion-text-center' style={{color: 'black'}}>Notifications</IonTitle>
            </IonHeader>
            <IonContent>
                {
                    filteredNotifications && filteredNotifications.map((notification, index)=> {
                        return (
                            <NotificationDisplay key={index} notificationDetails={notification}/>
                        )
                    })
                }
            </IonContent>
        </IonPage>
    );
}