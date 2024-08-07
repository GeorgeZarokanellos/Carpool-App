import { IonContent, IonHeader, IonPage, IonTitle } from "@ionic/react";
import React, { useEffect } from "react";
import instance from "../AxiosConfig";
import './NotificationPage.scss';
import { NotificationDisplay } from "../components/NotificationDisplay";
import { NotificationInterface } from "../interfacesAndTypes/Interfaces";


export const NotificationPage:React.FC = () => {
    const [notifications, setNotifications] = React.useState<NotificationInterface[]>([]);
    const [acceptReject, setAcceptReject] = React.useState<boolean>(false);
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');
    let queryParams = new URLSearchParams();
    if(userId !== null && userRole !== null) {
        queryParams = new URLSearchParams({
            userRole
        });
    }

    useEffect(() => {
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
        retrieveNotifications();
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonTitle class='ion-text-center' style={{color: 'black'}}>Notifications</IonTitle>
            </IonHeader>
            <IonContent>
                {
                    notifications.map((notification, index)=> {
                        return (
                            <NotificationDisplay key={index} notificationDetails={notification} setAcceptReject={setAcceptReject}/>
                        )
                    })
                }
            </IonContent>
        </IonPage>
    );
}