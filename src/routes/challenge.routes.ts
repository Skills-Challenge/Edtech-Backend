import express = require('express');
import ChallengeController from '../controllers/challenge.controller';
import isAuthenticated from '../middlewares/auth.middleware';
import restrictTo from "../middlewares/admin.middleware";

const router = express.Router();


router.post('/create', isAuthenticated, restrictTo("admin"), ChallengeController.createChallenge);
router.get('/get/:id', isAuthenticated, ChallengeController.getChallengeById);
router.get('/get-all',ChallengeController.getAllChallenges);
router.get('/stats', isAuthenticated, ChallengeController.getChallengeStats);
router.put('/update/:id', isAuthenticated, restrictTo("admin"),ChallengeController.updateChallenge);
router.delete('/delete/:id', isAuthenticated, restrictTo("admin"),ChallengeController.deleteChallenge);
router.post("/join/:id", isAuthenticated, ChallengeController.joinChallenge);
router.get("/total-participants", isAuthenticated, restrictTo("admin"), ChallengeController.getTotalParticipants);

const challengeRouter = router;
export default challengeRouter;