import { IonAlert, IonButton } from "@ionic/react";
import React, { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Statistics.scss'
import instance from "../../AxiosConfig";
import { Role, tripStatus } from "../../interfacesAndTypes/Types";
import { LineChart, Line, Tooltip, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

interface GraphDataFormat {
    date: Date,
    noOfEntries: number
}

export const Statistics: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    //trip graph related states
    const [tripStartDate, setTripStartDate] = useState<Date>(new Date(`${currentMonth + 1} 1,${currentYear} 00:00:00`));
    const [tripEndDate, setTripEndDate] = useState<Date | null>(null);
    const [tripGraphData, setTripGraphData] = useState<GraphDataFormat[]>();
    const [selectedTripStatus, setSelectedTripStatus] = useState<tripStatus>(tripStatus.COMPLETED);
    //user graph related states
    const [usersGraphData, setUsersGraphData] = useState<GraphDataFormat[]>();
    const [userStartDate, setUserStartDate] = useState<Date>(new Date(`${currentMonth + 1} 1,${currentYear} 00:00:00`));
    const [userEndDate, setUserEndDate] = useState<Date | null>(null);
    const [selectedUserRole, setSelectedUserRole] = useState<Role>(Role.ALL_ROLES);
    //Error alert states
    const [errorAlert, setErrorAlert] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

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

    const saveTripDatesOnChange = (dates: [Date | null, Date | null], setStartDate: (startDate: Date) => void, setEndDate: (endDate: Date | null) => void) => {
            const [startDate, endDate] = dates;
            if(startDate !== null){
                setStartDate(startDate);
                if(startDate && (!endDate || endDate < startDate))
                    setEndDate(null);
                else 
                    setEndDate(endDate);
            }
    }

    const handleChangeInTripStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
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

    const retrieveRegisteredUsers = async(startDate: Date, endDate: Date | null, selectedRole: Role) => {
        try {
            const usersResponse = await instance.get(`/admin/users?startDate=${startDate}&endDate=${endDate}&selectedRole=${selectedRole}`)
            if(usersResponse.status === 200){
                console.log(usersResponse.data);
                setUsersGraphData(usersResponse.data);
            } else if (usersResponse.status === 404){
                setErrorMessage('404 Error')
                setErrorAlert(true);
            }
        } catch (error) {
            setErrorMessage("Error retrieving users" + error as string);
            setErrorAlert(true);
        }
    }

    const handleChangeInUserRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        console.log(event.target.value);
        
        switch(event.target.value){
            case Role.DRIVER:
                setSelectedUserRole(Role.DRIVER);
                break;
            case Role.PASSENGER:
                setSelectedUserRole(Role.PASSENGER);
                break;
            case Role.ALL_ROLES:
                setSelectedUserRole(Role.ALL_ROLES);
                break;
            default: 
                setErrorMessage('Error selecting user role!');
                setErrorAlert(true);
        }
    }

    useEffect(() => {
        retrieveTrips(tripStartDate, null, tripStatus.COMPLETED);
        retrieveRegisteredUsers(userStartDate, null, Role.ALL_ROLES);
    }, []);

    return(
        <div className="statistics-container">
            <h1 style={{textDecoration: 'underline'}}>Statistics</h1>
            <div className="graph-cell">
                <h2>Number of trips per day</h2>
                <div className="graph-container">
                    <div className="picker-container">
                        <div className="date-label-picker">
                            <label htmlFor="">Select Date Interval</label>
                            <DatePicker 
                                className="date-picker"
                                selected={tripStartDate}
                                selectsRange
                                onChange={(dates) => saveTripDatesOnChange(dates, setTripStartDate, setTripEndDate)}
                                startDate={new Date(tripStartDate.toLocaleDateString())}
                                endDate={tripEndDate !== null ? tripEndDate : undefined}
                                dateFormat='dd/MM/yyyy'
                                required                            
                            />
                        </div>
                        <div className="second-option-label-picker">
                            <label htmlFor="second-option-picker">Selected Trip Status</label>
                            <select id="second-option-picker" required value={selectedTripStatus} onChange={handleChangeInTripStatus}>
                                <option value={tripStatus.COMPLETED}>Completed</option>
                                <option value={tripStatus.PLANNING}>Planning</option>
                                <option value={tripStatus.CANCELLED}>Cancelled</option>
                                <option value={tripStatus.INPROGRESS}>In Progress</option>
                            </select>
                        </div>
                        <div className="search-button">
                            <IonButton onClick={() => retrieveTrips(tripStartDate,tripEndDate,selectedTripStatus)}>Search</IonButton>
                        </div>
                    </div>
                    <div className="chart-container">
                        { tripGraphData && tripGraphData.length > 0 ?
                            (   
                                <ResponsiveContainer width="100%" height="100%" className="responsive-container">
                                    <LineChart className="trips-chart" data={tripGraphData as any}>
                                        <XAxis dataKey="date" />
                                        <YAxis dataKey="noOfEntries" />
                                        <Line type="monotone" dataKey="noOfEntries" name="No of trips"/>
                                        <Tooltip />
                                        <Legend />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="no-trips-to-display">
                                    No trips were found in the interval you specified!
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="graph-cell">
                <h2>Number of users registered</h2>
                <div className="graph-container">
                    <div className="picker-container">
                        <div className="date-label-picker">
                            <label htmlFor="">Select Date Interval</label>
                            <DatePicker 
                                className="date-picker"
                                selected={userStartDate}
                                selectsRange
                                onChange={(dates) => saveTripDatesOnChange(dates, setUserStartDate, setUserEndDate)}
                                startDate={new Date(userStartDate.toLocaleDateString())}
                                endDate={userEndDate !== null ? new Date(userEndDate.toLocaleDateString()) : undefined}
                                dateFormat='dd/MM/yyyy'
                                required                            
                            />
                        </div>
                        <div className="second-option-label-picker">
                            <label htmlFor="second-option-picker">Selected Trip Status</label>
                            <select id="second-option-picker" required value={selectedUserRole} onChange={handleChangeInUserRole}>
                                <option value={Role.DRIVER}>Driver</option>
                                <option value={Role.PASSENGER}>Passenger</option>
                                <option value={Role.ALL_ROLES}>All Roles</option>
                            </select>
                        </div>
                        <div className="search-button">
                            <IonButton onClick={() => retrieveRegisteredUsers(userStartDate, userEndDate, selectedUserRole)}>Search</IonButton>
                        </div>
                    </div>
                    <div className="chart-container">
                        { usersGraphData && usersGraphData.length > 0 ?
                            (   
                                <ResponsiveContainer width="100%" height="100%" className="responsive-container">
                                    <LineChart className="users-chart" data={usersGraphData as any}>
                                        <XAxis dataKey="date" />
                                        <YAxis dataKey="noOfEntries" />
                                        <Line type="monotone" dataKey="noOfEntries" name="Number of users registered"/>
                                        <Tooltip />
                                        <Legend />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="no-trips-to-display">
                                    No users were found in the interval you specified!
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <IonAlert 
                isOpen={errorAlert}
                onDidDismiss={() => setErrorAlert(false)}
                message={errorMessage}
                buttons={['OK']}
            /> 
        </div>
    )
}