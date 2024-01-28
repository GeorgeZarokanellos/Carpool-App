import express, {Router, Request, Response} from 'express';
import passport from 'passport';
import auth_controller from '../controllers/authentication_controller';

const router:Router = express.Router();

router.post('/login', passport.authenticate('local', {failureRedirect: '/api/v1/login-failure', successRedirect: '/api/v1/login-success'}));

router.get('/login', auth_controller.displayLogin);

router.get('/login-success', (req:Request,res:Response) => {
    res.status(200).send('Login successful');
});

router.get('/login-failure', (req:Request,res:Response) => {
    res.status(400).send('Login failed');
});

//export module for typescript
export default router;