import { IonAvatar, IonButton, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonRow, IonText, IonTitle } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { ExtendedTrip, Stop, Trip, TripStops } from "../interfacesAndTypes/Types";
import { TripTitle } from "./TripTitle";
import { formatDateTime } from "../util/common_functions";
import instance from "../AxiosConfig";
import { TripMapDisplay } from "./TripMapDisplay";
import './DetailedTripInformation.scss';
import { PassengersDetails } from "./PassengersDetails";
import { Swiper, SwiperSlide } from "swiper/react";
import { arrayBufferTo64String, StarRating } from "../util/common_functions";

//icons
import { calendarOutline, carOutline, peopleOutline, timeOutline } from "ionicons/icons";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HailIcon from '@mui/icons-material/Hail';


interface detailedTripInfoProps {
    clickedTripId: number;
}

export const DetailedTripInformation: React.FC<detailedTripInfoProps> = ({ clickedTripId }) => {

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight
    const [tripData, setTripData] = useState<ExtendedTrip>();

    useEffect(() => {
        instance.get(`/trips/${clickedTripId}`)
        .then(response => {
            console.log(response.data.tripStops);
            setTripData(response.data);
            // console.log('tripData', tripData);
            
        })
        .catch(error => {
            console.log(error);
        })
    }, [clickedTripId]);

    const checkAvailability = () => {
        if(tripData && tripData.driver !== null){
            return tripData.noOfPassengers + 1 < tripData.driver.vehicle.noOfSeats ? 'Αιτηση για συμμετοχη' : 'Οχημα πληρες';
        } else if (tripData && tripData.driver === null){
            return tripData.noOfPassengers < 4 ? 'Αιτηση για συμμετοχη' : 'Αναμενεται οδηγος';
        }
        
    }

    // const handleRequestForJoiningTrip = () => {

    // }

    useEffect(() => {
        console.log('tripData', tripData);
    }, [tripData]);

    return (
        <IonPage style={{height: `${viewportHeight}`, width: `${viewportWidth}`}}>
        { tripData && (
                <IonContent>
                    <TripMapDisplay tripStops={tripData.tripStops}/>
                    <div className="grid-contents">
                        <IonTitle class="ion-text-center">Πληροφορίες ταξιδιού</IonTitle>
                        <IonGrid>    
                            <IonRow>
                                <IonCol size="7" className="custom-col">
                                    <div className="passenger-time-info">
                                        <IonItem lines="none" >
                                            <IonIcon icon={timeOutline} slot="start" className="time-icon" />
                                            <IonLabel>{formatDateTime(tripData.startingTime).formattedTime}</IonLabel>
                                            <IonIcon icon={calendarOutline} className="calendar-icon" style={{marginRight: '0.5rem'}} />
                                            <IonLabel>{formatDateTime(tripData.startingTime).formattedDate}</IonLabel>
                                        </IonItem>
                                        <IonItem lines="none">
                                            <IonIcon icon={peopleOutline} slot="start" className="people-icon" />
                                            <IonLabel>{(tripData.driver? tripData.noOfPassengers + 1 + '/' + tripData.driver?.vehicle.noOfSeats : tripData.noOfPassengers) + ' συνεπιβάτες'} </IonLabel>
                                        </IonItem>
                                        <div className="passengers-details">
                                            <PassengersDetails passengers={tripData.tripPassengers}/>
                                        </div>
                                        <div className="driver-details">
                                            <IonItem lines="none" >
                                                <IonIcon icon={carOutline} slot="start" className="car-icon" />
                                                <IonLabel>Οδηγός</IonLabel>
                                            </IonItem>
                                            <IonItem lines="none">
                                                <IonAvatar style={{marginRight: '1rem', width: "50%"}}>
                                                    <img  
                                                        src={tripData.driver? arrayBufferTo64String(tripData.driver.user.profilePicture) : "https://ionicframework.com/docs/img/demos/avatar.svg" }
                                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                    />
                                                </IonAvatar>
                                                <div style={{display: "flex", flexDirection: "column"}}>
                                                    <IonLabel>{tripData.driver?.user.firstName + ' ' + tripData.driver?.user.lastName}</IonLabel>
                                                    <StarRating rating={Number(tripData.driver?.user.overallRating) } />
                                                </div>
                                            </IonItem>
                                        </div>
                                    </div>
                                </IonCol>
                                <IonCol size="5" className="custom-col">
                                    {/* <Swiper direction="vertical" freeMode={true} scrollbar={true} style={{height: '100%'}}> */}
                                        {/* <SwiperSlide> */}
                                            <div className="stops-display" style={{ overflowY: 'auto', maxHeight: '100%' }}>
                                                <div className="stop">
                                                    <LocationOnIcon />
                                                    {tripData.startLocation}
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="80px" viewBox="6 6 20 20">
                                                    <g transform="scale(1.4)">{/* used to scale only the arrow and not the rectangle around it */}
                                                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8 18l4 4m0 0l4-4m-4 4V2"/>
                                                    </g>
                                                </svg>
                                                {tripData.tripStops.map((stop, index) => {
                                                    return (
                                                        <>
                                                            <div key={index} className="stop">
                                                                <HailIcon />
                                                                {stop.details.stopLocation}
                                                            </div>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="80px" viewBox="6 6 20 20">
                                                                <g transform="scale(1.4)">{/* used to scale only the arrow and not the rectangle around it */}
                                                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8 18l4 4m0 0l4-4m-4 4V2"/>
                                                                </g>
                                                            </svg>
                                                        </>
                                                    );
                                                })}
                                                Πρυτανεία
                                            </div>
                                        {/* </SwiperSlide> */}
                                    {/* </Swiper> */}
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>
                </IonContent>
            
        )}
            <IonFooter style={{backgroundColor: "transparent"}}>
                
                <div className="join-leave-buttons">
                    <IonButton shape="round" >
                        {checkAvailability()}
                    </IonButton>
                </div>
            </IonFooter>
        </IonPage>
    )
}