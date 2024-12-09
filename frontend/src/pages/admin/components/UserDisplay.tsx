import React from "react"
import './UserDisplay.scss';
import { IonButton } from "@ionic/react";

interface UserDisplayInterface {
    universityId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone: string;
    overallRating: number;
    overallPoints: number;
    noOfReviews: number;
    tripsCompleted: number;
}

export const UserDisplay: React.FC<UserDisplayInterface> = (
    { universityId, firstName, lastName, email, role, phone, overallRating, overallPoints, noOfReviews, tripsCompleted}
) => {
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
                <label>{tripsCompleted + 2}</label>
                <IonButton color='danger'>Delete User</IonButton>
            </div>

    )
}