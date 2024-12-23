import { IonAlert, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState} from "react";
import { DetailedTripInformation } from "../components/DetailedTripInformation";
import instance from "../AxiosConfig";
import { MenuButton } from "../components/MenuButton";
import { useHistory } from "react-router";

interface CurrentTripPageProps {
    refreshKey: number;
}

export const CurrentTripPage: React.FC<CurrentTripPageProps> = ({refreshKey}) => {
    
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');
    const history = useHistory();
    const [currentTripId, setCurrentTripId] = useState<number>(0);
    const [tripCompleted, setTripCompleted] = useState<boolean>(false);
    const [userUpdateFinished, setUserUpdateFinished] = useState<boolean>(false);
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;      

    const retrieveCurrentTripId = async () => {
        try {
            const response = await instance.get(`/user/${userId}`)
            if(userRole === "passenger" && response.data.currentTripId === null && response.data.tripCompleted === true){
                await updateTripCompleted();
            }
            setCurrentTripId(response.data.currentTripId);
        } catch (error) {
            console.log("Error retrieving current trip id", error);
        }
    }

    const updateTripCompleted = async () => {
        await instance.patch(`/user/${userId}`, {tripCompleted: false})
        .then((response) => {
            console.log("response", response);
            setUserUpdateFinished(true);
        })
        .catch((error) => {
            console.log("Error updating trip completed in user", error);
        });
    }

    useEffect(() => {        
        retrieveCurrentTripId();
    }, [refreshKey]);

    useEffect(() => {
        if(userUpdateFinished){
            setTripCompleted(true);
        }
    }, [userUpdateFinished]);
    
    return (
        
        <IonPage style={{ height: `${viewportHeight}`, width: `${viewportWidth}` }}>
            <div className="centering-container" >
                <div className="limiting-container">
                    <IonHeader>
                        <IonToolbar>
                            <MenuButton/>
                            <IonTitle  style={{color: 'black'}}>Current Trip</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <DetailedTripInformation clickedTripId={Number(currentTripId)} page="currentTrip" refreshKey={refreshKey}/>
                    <IonAlert 
                        isOpen={tripCompleted}
                        onDidDismiss={() => {
                            setTripCompleted(false);
                            history.push('/main/notifications');
                            window.location.reload();

                        }}
                        header={'Trip Completed'}
                        message={'This trip has been completed. Please take some time to review the participants!'}
                        buttons={['OK']}
                    />    
                </div>
            </div>
        </IonPage>
    )
}