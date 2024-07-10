import React from "react";
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface RatingProps {
    rating: number;
}

export const StarRating: React.FC<RatingProps> = ({ rating }) => {
    return (
        <Rating name="read-only" value={rating} precision={0.5} readOnly />
    )
}

export const formatDate = (dateString: string | Date) => {
    let dateParts: string[] = [];
    let formattedDate: string;
    if(dateString instanceof Date){
        dateParts = dateString.toString().split('-');
    } else 
        dateParts = dateString.split('-');
    if(dateParts.length !== 0){
        formattedDate = `${dateParts[1]}/${dateParts[2]}`;
        return formattedDate;
    } else 
        console.log("DateParts is empty:", dateParts);
        
}

export const formatDateTime = (dateString: string) => {
    const dateTimeParts = dateString.split('T');
    console.log(dateTimeParts);
    const formattedDate = formatDate(dateTimeParts[0]);
    console.log(formattedDate);
    const timeParts = `${dateTimeParts[1]}`.split(':');
    console.log(timeParts);
    const formattedTime = `${timeParts[0]}:${timeParts[1]}`;
    
    return {
        formattedDate,
        formattedTime
    }
}