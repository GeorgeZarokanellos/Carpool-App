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