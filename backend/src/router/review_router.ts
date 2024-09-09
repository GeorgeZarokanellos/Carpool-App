// import { check, validationResult } from 'express-validator';
import { getReviews, createReview, updateReview, deleteReview } from '../controller/review_controller';
import express from 'express';
import {reviewValidationRules} from '../util/validator/review_validator';
import {validate} from '../util/common_functions';


const router = express.Router();


router.get('/:id', getReviews);
router.post('/:tripId', reviewValidationRules() , createReview);
router.patch('/:id', reviewValidationRules(), updateReview);
router.delete('/:id', deleteReview);

export default router;
