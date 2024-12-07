import React, { useEffect, useState } from 'react';
import './Users.scss';
import instance from '../../AxiosConfig';
import { UserDisplay } from './UserDisplay';
import { IonLoading } from '@ionic/react';

type User = {
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

export const Users: React.FC = () => {

    const [usersList, setUsersList] = useState<User[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const retrieveUsers = async () => {
        try {
            setIsLoading(true);
            const response = await instance.get('/admin/users');
            console.log(response.data);
            setUsersList(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        retrieveUsers();
    }, []);

    return(
        <div>
            <h1>Users</h1>
            <div className='list-display'>
                <div className='users-list'>
                    <table>
                        <thead>
                            <tr >
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Role</th>
                                <th>Id</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Overall Rating</th>
                                <th>Overall Points</th>
                                <th>No of Reviews</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                usersList != null && usersList.map((user) => {
                                    return (
                                        <UserDisplay 
                                            universityId={user.universityId}
                                            firstName={user.firstName}
                                            lastName={user.lastName}
                                            email={user.email}
                                            role={user.role}
                                            phone={user.phone}
                                            overallRating={user.overallRating}
                                            overallPoints={user.overallPoints}
                                            noOfReviews={user.noOfReviews}
                                            tripsCompleted={user.tripsCompleted}
                                            key={user.universityId}
                                        />
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <IonLoading 
                isOpen={isLoading}
                message='Loading users'
            />
        </div>
    )
}