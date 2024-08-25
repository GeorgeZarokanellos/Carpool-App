import { IonContent, IonHeader, IonPage, IonTitle } from "@ionic/react";
import React, { useEffect, useState } from "react";
import instance from "../AxiosConfig";
import './NotificationPage.scss';
import { NotificationDisplay } from "../components/NotificationDisplay";
import { NotificationInterface } from "../interfacesAndTypes/Interfaces";

interface NotificationPageProps {
    refreshKey: number;
}

export const NotificationPage:React.FC<NotificationPageProps> = ({refreshKey}) => {
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

    const retrieveNotifications = async () => {

        try {
            console.log(`/notifications/${userId}?${queryParams.toString()}`);
            await instance.get(`/notifications/${userId}?${queryParams.toString()}`)
            .then(response => {
                console.log(response.data);
                setNotifications(response.data);
            })
            .catch(error => {
                console.log("Error retrieving notifications", error);
            });
        } catch (error) {
            console.log("Error retrieving notifications", error);
        }

    }

    useEffect(() => {
        retrieveNotifications();
    }, [refreshKey]);

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

    useEffect(() => {
        if(filteredNotifications){
            // window.location.reload();
            console.log("Filtered Notifications", filteredNotifications);
        }
    }, [filteredNotifications]);

    useEffect(() => {
        console.log("Notifications refresh key", refreshKey);
    }, [refreshKey]);

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