import React, { useState } from "react"
import './UserDisplay.scss';

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
    const [isOpen, setIsOpen] = useState(false);
    return(
            <tr>
                <td>{firstName}</td>
                <td>{lastName}</td>
                <td>{role}</td>
                <td>{universityId}</td>
                <td>{email}</td> 
                <td>{phone}</td>
                <td>{overallRating}</td>
                <td>{overallPoints}</td>
                <td>{noOfReviews}</td>
                {/* <td>{tripsCompleted}</td> */}
            </tr>

    )
}