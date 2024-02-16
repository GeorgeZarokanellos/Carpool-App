import { getReviews } from '../controllers/reviews_controller';
import express from 'express';

const router = express.Router();


router.get('/:id', getReviews);
router.post('/:reviewedPersonId', createReview);

export default router;