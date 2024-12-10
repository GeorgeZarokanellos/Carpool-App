import React from "react"
import './UserDisplay.scss';
import { IonButton } from "@ionic/react";
import { formatDateTime } from "../../../util/common_functions";

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
                <label>{overallRating}</label>
                <label>{overallPoints}</label>
                <label>{noOfReviews}</label>
                <label>{tripsCompleted}</label>
                <label>{formatDateTime(joinedAt).formattedDate + '/' + formattedYear}</label>
                <IonButton color='danger' onClick={() => setUserToBeDeleted(userId)}>Delete</IonButton>
            </div>

    )
}