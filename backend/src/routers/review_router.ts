// import { check, validationResult } from 'express-validator';
import { getReviews, createReview, updateReview, deleteReview } from '../controllers/reviews_controller';
import express from 'express';

const router = express.Router();


router.get('/:id', getReviews);
router.post('/:reviewedPersonId', createReview);
router.patch('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

export default router;