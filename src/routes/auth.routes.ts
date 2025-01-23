import express = require('express');
import AuthController from '../controllers/auth.controller';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
router.get('/me/', AuthController.getCurrentUser);
router.get('/logout', AuthController.logout);

const authRouter = router;
export default authRouter;
