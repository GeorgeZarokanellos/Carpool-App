import express from 'express';
import passport from 'passport';
import '../controller/authentication_controller';

const router = express.Router();

router.post('/login', passport.authenticate('local'), (req,res) => {
    res.status(200).send('Login successful');
});

// router.get('/login-success', (req:Request,res:Response) => {
//     res.status(200).send('Login successful');
// });

// router.get('/login-failure', (req:Request,res:Response) => {
//     res.status(401).send('Login failed');
// });

// export module for typescript
export default router;