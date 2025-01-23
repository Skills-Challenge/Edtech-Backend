import express = require('express');
import ChallengeController from '../controllers/challenge.controller';
import isAuthenticated from '../middlewares/auth.middleware';
import restrictTo from "../middlewares/admin.middleware";

const router = express.Router();


router.post('/create', isAuthenticated, restrictTo("admin"), ChallengeController.createChallenge);
router.get('/get/:id', isAuthenticated,restrictTo("admin"), ChallengeController.getChallengeById);
router.get('/get-all', isAuthenticated, ChallengeController.getAllChallenges);
router.put('/update/:id', isAuthenticated, restrictTo("admin"),ChallengeController.updateChallenge);
router.delete('/delete/:id', isAuthenticated, restrictTo("admin"),ChallengeController.deleteChallenge);

const challengeRouter = router;
export default challengeRouter;