import { IonHeader, IonPage, IonTitle } from "@ionic/react";
import React, { useEffect} from "react";
import { DetailedTripInformation } from "../components/DetailedTripInformation";
import instance from "../AxiosConfig";

interface CurrentTripPageProps {
    refreshKey: number;
}

export const CurrentTripPage: React.FC<CurrentTripPageProps> = ({refreshKey}) => {
    
    const userId = localStorage.getItem('userId');
    const userIdInt = Number(userId);
    const [currentTripId, setCurrentTripId] = React.useState<number>(0);
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;      

    const retrieveCurrentTripId = async () => {
        await instance.get(`/user/${userIdInt}`)
        .then((response) => {
            console.log("response", response.data);
            setCurrentTripId(response.data.currentTripId);
            
        })
        .catch((error) => {
            console.log("Error retrieving current trip id", error);
        });
    }

    useEffect(() => {        
        if(userIdInt){
            retrieveCurrentTripId();
        }
    }, [refreshKey]);
    
    return (
        
        <IonPage style={{ height: `${viewportHeight}`, width: `${viewportWidth}` }}>
            <IonHeader>
                <IonTitle class="ion-text-center" style={{color: 'black'}}>Current Trip</IonTitle>
            </IonHeader>
            <DetailedTripInformation clickedTripId={Number(currentTripId)} page="currentTrip" refreshKey={refreshKey}/>    
        </IonPage>
    )
}