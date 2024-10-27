import express from 'express';

import { 
        getNotifications, 
        getNotification, 
        createNotification, 
        updateNotification,
        deleteNotification 
    } from '../controller/notification_controller';

const router = express.Router();

router.get('/:userId', getNotifications);
router.get('/:notificationId', getNotification);
router.post('/', createNotification);
router.patch('/:notificationId', updateNotification);
router.delete('/:notificationId', deleteNotification);

export default router;