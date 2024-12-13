import { IonAlert, IonButton } from "@ionic/react";
import React, { useEffect, useMemo, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Statistics.scss'
import instance from "../../AxiosConfig";
import { tripStatus } from "../../interfacesAndTypes/Types";
import { LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

interface GraphDataFormat {
    date: Date,
    noOfTrips: number
}

export const Statistics: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [startDate, setStartDate] = useState<Date>(new Date(`December 1,${currentYear} 00:00:00`));
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [tripGraphData, setTripGraphData] = useState<GraphDataFormat>();
    const [nullDatesAlert, setNullDatesAlert] = useState<boolean>(false);
    const [errorAlert, setErrorAlert] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [selectedTripStatus, setSelectedTripStatus] = useState<tripStatus>(tripStatus.COMPLETED);

    const retrieveTrips = async (startDate: Date , endDate: Date | null, tripStatus: tripStatus) => {
        try {   
            const graphDataResponse = await instance.get(`/admin/trips?startDate=${startDate}&endDate=${endDate}&status=${tripStatus}`);
            if(graphDataResponse.status === 200){
                console.log(graphDataResponse.data);
                setTripGraphData(graphDataResponse.data)
            } else if (graphDataResponse.status === 404){
                setErrorMessage('404 Error')
                setErrorAlert(true);
            }
        } catch (error) {
            setErrorMessage("Error retrieving trips" + error as string);
            setErrorAlert(true);
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
    
    const handleChangeInStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        switch(event.target.value){
            case 'completed': 
                setSelectedTripStatus(tripStatus.COMPLETED);
                break;
            case 'planning':
                setSelectedTripStatus(tripStatus.PLANNING);
                break;
            case 'cancelled':
                setSelectedTripStatus(tripStatus.CANCELLED);
                break;
            case 'in_progress':
                setSelectedTripStatus(tripStatus.INPROGRESS);
                break;
            default:
                setErrorMessage('Error selecting trip status');
                setErrorAlert(true);
        } 
            
    }

    useEffect(() => {
        retrieveTrips(startDate, null, tripStatus.COMPLETED);
    }, [])

    return(
        <div className="statistics-container">
            <h1>Statistics</h1>
            <div className="trips-graph-container">
                <div className="picker-container">
                    <div className="date-label-picker">
                        <label htmlFor="">Select Date Interval</label>
                        <DatePicker 
                            className="date-picker"
                            selected={startDate}
                            selectsRange
                            onChange={saveDatesOnChange}
                            startDate={startDate}
                            endDate={endDate !== null ? endDate : undefined}
                            required                            
                        />
                    </div>
                    <div className="status-label-picker">
                        <label htmlFor="trip-status-picker">Selected Trip Status</label>
                        <select id="trip-status-picker" required value={selectedTripStatus} onChange={handleChangeInStatus}>
                            <option value={tripStatus.COMPLETED}>Completed</option>
                            <option value={tripStatus.PLANNING}>Planning</option>
                            <option value={tripStatus.CANCELLED}>Cancelled</option>
                            <option value={tripStatus.INPROGRESS}>In Progress</option>
                        </select>
                    </div>
                    <IonButton onClick={() => retrieveTrips(startDate,endDate,selectedTripStatus)}>Search</IonButton>
                </div>
                <div className="graph-container">
                    <ResponsiveContainer width="100%" height="100%" className="responsive-container">
                        <LineChart className="trips-chart" data={tripGraphData as any}>
                            <XAxis dataKey="Date" />
                            <YAxis dataKey="TripCount" />
                            <Line type="monotone" dataKey="TripCount"/>
                            <Tooltip />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="users-graph-container">
                <div className="picker-container">
                    <label htmlFor="">Select Date Interval</label>
                    <DatePicker 
                        className="date-picker"
                        selected={startDate}
                        selectsRange
                        onChange={saveDatesOnChange}
                        startDate={startDate}
                        endDate={endDate !== null ? endDate : undefined}
                        required                            
                    />
                </div>
            </div>
            <IonAlert 
                isOpen={nullDatesAlert}
                onDidDismiss={() => setNullDatesAlert(false)}
                message='You haven&apos;t selected both dates'
                buttons={['OK']}
            />
            <IonAlert 
                isOpen={errorAlert}
                onDidDismiss={() => setErrorAlert(false)}
                message={errorMessage}
                buttons={['OK']}
            /> 
        </div>
    )
}