import React from "react";
import Rating from '@mui/material/Rating';

interface RatingProps {
    rating: number;
}

export const StarRating: React.FC<RatingProps> = ({ rating }) => {
    return (
        <Rating name="read-only" value={rating} precision={0.5} readOnly />
    )
}

export const formatDate = (dateString: string | Date): string => {
    let dateParts: string[] = [];
    if(dateString instanceof Date){
        dateParts = dateString.toString().split('-');
    } else 
        dateParts = dateString.split('-');
    if(dateParts.length !== 0 && dateParts.length >= 3){
        return `${dateParts[1]}/${dateParts[2]}`;
    } else {
        console.log("DateParts is empty:", dateParts);
        return ""; // Add a return statement here
    }
}

export const formatDateTime = (dateString: string): {formattedDate: string, formattedTime: string} => {
    let formattedDate: string;
    let formattedTime: string;

    const dateTimeParts = dateString.split('T');
    const timeParts = `${dateTimeParts[1]}`.split(':');
    if(dateTimeParts[0] && timeParts.length >= 2){
        formattedDate = formatDate(dateTimeParts[0]);
        formattedTime = `${timeParts[0]}:${timeParts[1]}`;
        return {
            formattedDate,
            formattedTime
        }
    } else {
        console.log("DateParts or timeParts is empty:", dateTimeParts, timeParts);
        return {
            formattedDate: "",
            formattedTime: ""
        }
    }    
    
}