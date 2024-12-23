import React, { useEffect, useState } from 'react';
import './Users.scss';
import instance from '../../AxiosConfig';
import { UserDisplay } from './components/UserDisplay';
import { IonAlert, IonLoading } from '@ionic/react';
import { Pagination } from "@mui/material";

type User = {
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
    noOfTripsCompleted: number;
    joinedAt: string;
}

export const Users: React.FC = () => {

    const [usersList, setUsersList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [userDeletionConfirmation, setUserDeletionConfirmation] = useState<boolean>(false);
    const [userDeletionError, setUserDeletionError] = useState<boolean>(false);
    const [userDeletedAlert, setUserDeletedAlert] = useState<boolean>(false);
    const [userToBeDeleted, setUserToBeDeleted] = useState<number>(0);
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

    const deleteUser = async (userId: number) => {
        try {
            const user = await instance.delete(`/admin/user/${userId}`);
            if(user.status == 200){
                retrieveUsers();
                setUserDeletedAlert(true);
            } else if(user.status === 404){
                setUserDeletionError(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }

    useEffect(() => {
        retrieveUsers();
    }, []);

    useEffect(() => {
        if(userToBeDeleted !== 0)
            setUserDeletionConfirmation(true);
    }, [userToBeDeleted]);

    return(
        <div className='users-list-container'>
            <h1>Users List</h1>
            <div className='list-display'>
                <div className='users-list'>
                    <div className='list-header'>
                        <label>First <br/> Name</label>
                        <label>Last <br/> Name</label>
                        <label>User <br/> Role</label>
                        <label>University <br/> ID</label>
                        <label>Email <br/> Address</label>
                        <label>Phone <br/> Number</label>
                        <label>Joined <br/> At</label>
                    </div>
                     {
                        usersList != null && paginatedUsers.map((user, index) => {
                            return (
                                <UserDisplay 
                                    userId={user.userId}
                                    universityId={user.universityId}
                                    firstName={user.firstName}
                                    lastName={user.lastName}
                                    email={user.email}
                                    role={user.role}
                                    phone={user.phone}
                                    overallRating={user.overallRating}
                                    overallPoints={user.overallPoints}
                                    noOfReviews={user.noOfReviews}
                                    tripsCompleted={user.noOfTripsCompleted}
                                    joinedAt={user.joinedAt}
                                    setUserToBeDeleted={setUserToBeDeleted}
                                    key={index}
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
            <IonAlert 
                isOpen={userDeletionConfirmation}
                onDidDismiss={() => setUserDeletionConfirmation(false)}
                header='Delete User'
                message='Are you sure you want to delete this user?'
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            setUserDeletionConfirmation(false);
                        }
                    },
                    {
                        text: 'Delete',
                        handler: () => {
                            deleteUser(userToBeDeleted);
                        }
                    }
                ]}
            />
            <IonAlert 
                isOpen={userDeletionError}
                onDidDismiss={() => setUserDeletionError(false)}
                header='Error'
                message='User not found'
                buttons={['OK']}
            />
            <IonAlert 
                isOpen={userDeletedAlert}
                onDidDismiss={() => setUserDeletedAlert(false)}
                header='User Deleted'
                message='User has been successfully deleted'
                buttons={['OK']}
            />
        </div>
    )
}