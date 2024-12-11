import { IonAlert, IonButton } from "@ionic/react";
import React, { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Statistics.scss'
import instance from "../../AxiosConfig";
import { tripStatus } from "../../interfacesAndTypes/Types";

interface TripShortInfo {
    tripId: number,
    tripCreatorId: number,
    driverId: number,
    startLocationId: number,
    endLocationId: number,
    startingTime: string,
    noOfPassengers: number,
    noOfStops: number,
    status: tripStatus
}

export const Statistics: React.FC = () => {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [tripsList, setTripsList] = useState<TripShortInfo[]>([]);
    const [nullDatesAlert, setNullDatesAlert] = useState<boolean>(false);
    const [errorRetrievingTripsAlert, setErrorRetrievingTripsAlert] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const retrieveTrips = async (startDate: Date , endDate: Date | null) => {
        try {   
            const tripsList = await instance.get(`/admin/trips?startDate=${startDate}&endDate=${endDate}&status=${tripStatus.COMPLETED}`);
            if(tripsList.status === 200){
                setTripsList(tripsList.data);
            } else if (tripsList.status === 404){
                setErrorMessage('')
                setErrorRetrievingTripsAlert(true);
            }
        } catch (error) {
            setErrorMessage(error as string);
            setErrorRetrievingTripsAlert(true);
        }
    }

    const saveDatesOnChange = (dates: [Date | null, Date | null]) => {
            const [startDate, endDate] = dates;
            if(startDate !== null){
                setStartDate(startDate);
                if(startDate && (!endDate || endDate < startDate))
                    setEndDate(null);
                else 
                    setEndDate(endDate);
            }
        }

    useEffect(() => {
        console.log(tripsList);        
    }, [tripsList]);
    

    return(
        <div className="statistics-container">
            <h1>Statistics</h1>
            <div className="trips-graph-container">
                <div className="picker-container">
                    <label>Select date interval</label>
                    <DatePicker 
                        className="date-picker"
                        selected={startDate}
                        selectsRange
                        onChange={saveDatesOnChange}
                        startDate={startDate}
                        endDate={endDate !== null ? endDate : undefined}
                        
                    />
                    <IonButton onClick={() => retrieveTrips(startDate,endDate)}>Search</IonButton>
                </div>
                <div className="graph-container">

                </div>
            </div>
            <div className="users-graph-container"></div>
            <IonAlert 
                isOpen={nullDatesAlert}
                onDidDismiss={() => setNullDatesAlert(false)}
                message='You haven &apos;t selected both dates'
                buttons={['OK']}
            />
            <IonAlert 
                isOpen={errorRetrievingTripsAlert}
                onDidDismiss={() => setErrorRetrievingTripsAlert(false)}
                message={errorMessage}
                buttons={['OK']}
            /> 
        </div>
    )
}