import React, { useState } from "react"
import './UserDisplay.scss';
import { IonButton } from "@ionic/react";
import { formatDateTime } from "../../../util/common_functions";
import { CCard, CCardBody, CCollapse } from "@coreui/react";

interface UserDisplayInterface {
    userId: number;
    universityId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone: string;
    overallRating: string;
    overallPoints: number;
    noOfReviews: number;
    tripsCompleted: number;
    joinedAt: string;
    setUserToBeDeleted: (userId: number) => void;
}

export const UserDisplay: React.FC<UserDisplayInterface> = (
    { userId, universityId, firstName, lastName, email, role, phone, overallRating, overallPoints, noOfReviews, tripsCompleted, joinedAt, setUserToBeDeleted}
) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const year = new Date(joinedAt).getFullYear();
    const formattedYear = year.toString().slice(2,4);
    return(
            <div className="list-row">
                <label>{firstName}</label>
                <label>{lastName}</label>
                <label>{role}</label>
                <label>{universityId}</label>
                <label>{email}</label> 
                <label>{phone}</label>
                <label>{formatDateTime(joinedAt).formattedDate + '/' + formattedYear}</label>
                <IonButton color='primary' onClick={() => setIsExpanded(!isExpanded)}>See Details</IonButton>
                <IonButton color='danger' onClick={() => setUserToBeDeleted(userId)}>Delete</IonButton>
                <div className="extend-user-info-container">
                    <CCollapse visible={isExpanded} className="user-detailed-info">
                        <CCard>
                            <CCardBody>
                                <p style={{margin: '0'}}>
                                    <span>Overall Rating: {overallRating}/5 </span>
                                    <span>Overall Points: {overallPoints}</span>
                                    <span>No of Reviews: {noOfReviews}</span>
                                    <span>Trips Completed: {tripsCompleted}</span>
                                </p>
                            </CCardBody>
                        </CCard>
                    </CCollapse>
                </div>
            </div>

    )
}