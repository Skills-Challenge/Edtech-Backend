import { Request, Response } from 'express';
import ChallengeService from '../services/challenge.service';
import AppError from '../utils/AppError';

export default class ChallengeController {
  public static createChallenge = async (req: Request, res: Response) => {
    try {
      const challenge = await ChallengeService.createChallenge(req.body);
      res
        .status(201)
        .json({
          status: 'success',
          message: 'Challenge created successfully',
          challenge,
        });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      throw new AppError('Internal server error', 500);
    }
  };

  public static getChallengeById = async (req: Request, res: Response) => {
    try {
      const challenge = await ChallengeService.getChallengeById(req.params.id);
      if (!challenge) {
        res.status(404).json({ message: 'Challenge not found' });
        throw new AppError('Not found', 404);
      }
      res.status(200).json({ status: 'success', challenge });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      throw new AppError('Not found', 404);
    }
  };

  public static getAllChallenges = async (req: Request, res: Response) => {
    try {
      const challenges = await ChallengeService.getAllChallenges();
      res.status(200).json({ status: 'success', challenges });
    } catch (error: any) {
      res.status(500).json({ message: 'Internal server error' });
      throw new AppError('Internal server error', 500);
    }
  };


  public static updateChallenge = async (req: Request, res: Response) => {
     try{
        const challenge = await ChallengeService.updateChallenge(req.params.id, req.body);
        res.status(200).json({ status: 'success', challenge });
     }catch(error: any){
         res.status(500).json({ message: 'Internal server error' });
         throw new AppError(`${error?.message}`, 500);
     }
  }

  public static deleteChallenge = async (req: Request, res: Response) => {
    try {
      const challenge = await ChallengeService.deleteChallenge(req.params.id);
      res.status(200).json({ status: 'success', message: 'Challenge deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: `${error?.message}` });
      throw new AppError(`${error?.message}`, 500);
    }
  }
}
