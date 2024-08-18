import React from 'react';

interface TripTitleProps {
    dateOfTrip: string;
    tripCreator: {
        firstName: string;
        lastName: string;
    }
}

export const TripTitle: React.FC<TripTitleProps> = ({dateOfTrip, tripCreator}) => {
    const today = new Date();
    const tripDate = new Date(dateOfTrip);
    const isTripToday = today.getDate() === tripDate.getDate() &&
                        today.getMonth() === tripDate.getMonth() &&
                        today.getFullYear() === tripDate.getFullYear();
    return (
        <div className='title' style={{textAlign: "center", color: 'black'}}>
            {'Διαδρομή του/της ' + tripCreator.firstName + ' ' + tripCreator.lastName + ' για ' + (isTripToday ? 'σήμερα' : 'της ' + dateOfTrip) }
        </div>
    )
}