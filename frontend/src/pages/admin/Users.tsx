import React, { useEffect, useState } from 'react';
import './Users.scss';
import instance from '../../AxiosConfig';
import { UserDisplay } from './components/UserDisplay';
import { IonLoading } from '@ionic/react';
import { Pagination } from "@mui/material";

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

    const [usersList, setUsersList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const paginatedUsers = usersList.slice((page-1)*itemsPerPage, itemsPerPage*page);

    const retrieveUsers = async () => {
        try {
            setIsLoading(true);
            const response = await instance.get('/admin/users');
            console.log(response.data);
            setUsersList(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }

    useEffect(() => {
        retrieveUsers();
    }, []);

    return(
        <div>
            <h1>Users</h1>
            <div className='list-display'>
                <div className='users-list'>
                    <div className='list-header'>
                        <label>First Name</label>
                        <label>Last Name</label>
                        <label>Role</label>
                        <label>University ID</label>
                        <label>Email</label>
                        <label>Phone</label>
                        <label>Overall Rating</label>
                        <label>Overall Points</label>
                        <label>No of Reviews</label>
                        <label>Trips Completed</label>
                    </div>
                     {
                        usersList != null && paginatedUsers.map((user) => {
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
                    <Pagination 
                        count={Math.ceil(usersList?.length / itemsPerPage)}
                        page={page}
                        shape="rounded"
                        onChange={handlePageChange}
                    />
                </div>
            </div>
            <IonLoading 
                isOpen={isLoading}
                message='Loading users'
            />
        </div>
    )
}