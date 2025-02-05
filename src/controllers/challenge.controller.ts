import { Request, Response } from 'express';
import ChallengeService from '../services/challenge.service';
import AppError from '../utils/AppError';

/**
 * @swagger
 * tags:
 *   name: Challenge
 *   description: Everything about your Challenge
 */
export default class ChallengeController {
  /**
   * @swagger
   * /challenge/create:
   *  post:
   *   description: create a challenge
   *   parameters:
   *         - in: body
   *           name: challenge
   *           description: create a challenge
   *           schema:
   *             type: object
   *             required:
   *                - title
   *                - startTime
   *                - deadline
   *                - duration
   *                - prize
   *                - contactEmail
   *                - description
   *                - brief
   *                - requirements
   *                - deliverables
   *                - skills
   *                - seniorityLevel
   *             properties:
   *                title:
   *                  type: string
   *                startTime:
   *                  type: string
   *                deadline:
   *                  type: string
   *                duration:
   *                  type: string
   *                prize:
   *                   type: string
   *                contactEmail:
   *                   type: string
   *                description:
   *                    type: array
   *                    items:
   *                      type: string
   *                brief:
   *                    type: string
   *                requirements:
   *                    type: array
   *                    items:
   *                      type: string
   *                deliverables:
   *                    type: array
   *                    items:
   *                      type: string
   *                skills:
   *                    type: array
   *                    items:
   *                      type: string
   *                seniorityLevel:
   *                    type: string
   *   responses:
   *        201:
   *          description: Challenge created successfully
   *        400:
   *          description: validation errors
   *        500:
   *          description: Internal Server Error
   *
   *
   */
  public static readonly createChallenge: (
    req: Request,
    res: Response,
  ) => Promise<void> = async (req: Request, res: Response) => {
    try {
      const challenge = await ChallengeService.createChallenge(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Challenge created successfully',
        challenge,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      throw new AppError('Internal server error', 500);
    }
  };

  /**
   * @swagger
   * /challenge/get/{id}:
   *   get:
   *     summary: Get a challenge by ID
   *     description: Retrieve details of a challenge using its unique ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The unique ID of the challenge.
   *     responses:
   *       200:
   *         description: Challenge found
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal Server Error
   */

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

  /**
   * @swagger
   * /challenge/get-all:
   *  get:
   *   summary: Get all challenges
   *   description: Retrieve all challenges
   *   responses:
   *    200:
   *     description: Challenges found
   *    401:
   *     description: Unauthorized
   *    500:
   *     description: Internal Server Error
   */

  public static getAllChallenges = async (req: Request, res: Response) => {
    try {
      const { challenges  , totalChallenges }= await ChallengeService.getAllChallenges(req.query);
      res.status(200).json({
        status: "success",
        totalChallenges,
        challenges,
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Internal server error' });
      throw new AppError('Internal server error', 500);
    }
  };

  /**
   * @swagger
   * /challenge/update/{id}:
   *  put:
   *   summary: Update a challenge
   *   description: Update a challenge using its unique ID.
   *   parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *          type: string
   *          description: The unique ID of the challenge.
   *       - in: body
   *         name: challenge
   *         description: create a challenge
   *         schema:
   *           type: object
   *           required:
   *                - title
   *                - deadline
   *                - duration
   *                - prize
   *                - contactEmail
   *                - description
   *                - brief
   *                - requirements
   *                - deliverables
   *           properties:
   *                title:
   *                  type: string
   *                deadline:
   *                  type: Date
   *                duration:
   *                  type: string
   *                prize:
   *                   type: string
   *                contactEmail:
   *                   type: string
   *                description:
   *                    type: string
   *                brief:
   *                    type: string
   *                requirements:
   *                    type: string
   *                deliverables:
   *                    type: string
   *   responses:
   *        201:
   *          description: Challenge created successfully
   *        400:
   *          description: validation errors
   *        500:
   *          description: Internal Server Error
   *
   *
   */

  public static updateChallenge = async (req: Request, res: Response) => {
    try {
      const challenge = await ChallengeService.updateChallenge(
        req.params.id,
        req.body,
      );
      res.status(200).json({ status: 'success', challenge });
    } catch (error: any) {
      res.status(500).json({ message: 'Internal server error' });
      throw new AppError(`${error?.message}`, 500);
    }
  };


  /**
   * @swagger
   * /challenge/stats:
   *  get:
   *   summary: Get challenge stats
   *   description: Get challenge stats
   *   responses:
   *       200:
   *        description: Retrieved All stats
   *       401:
   *        description: unauthorized
   *       500: 
   *        description: Internal server error
  */


  public static getChallengeStats = async (req: Request, res: Response) => {
    try{

      const challengeStats = await ChallengeService.getChallengeStats();
      res.status(200).json({ status: 'success', challengeStats });
    }catch(error: any){
      res.status(500).json({ message: 'Internal server error' });
      throw new AppError(`${error?.message}`, 500);
    }
  }

  /**
   * @swagger
   * /challenge/delete/{id}:
   *  delete:
   *   summary: Delete a challenge
   *   description: Delete a challenge using its unique ID.
   *   parameters:
   *     - in: path
   *       name: id
   *       description: The unique ID of the challenge.
   *       required: true
   *       schema:
   *         type: string
   *   responses:
   *      200:
   *        description: Challenge deleted successfully
   *      400:
   *        description: Challenge not found
   *      500:
   *        description: Internal Server Error
   */
  public static deleteChallenge = async (req: Request, res: Response) => {
    try {
      const challenge = await ChallengeService.deleteChallenge(req.params.id);
      res
        .status(200)
        .json({ status: 'success', message: 'Challenge deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: `${error?.message}` });
      throw new AppError(`${error?.message}`, 500);
    }
  };


   /**
   * @swagger
   * /challenge/join/{id}:
   *  post:
   *   summary: Join a challenge
   *   description: Allows a user to join a challenge using its unique ID.
   *   parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       schema:
   *         type: string
   *       description: The unique ID of the challenge.
   *   responses:
   *     200:
   *       description: Successfully joined the challenge
   *     400:
   *       description: User ID is required
   *     500:
   *       description: Internal Server Error
   */
  public static joinChallenge = async(req: Request, res: Response) => {
    try{
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const challenge = await ChallengeService.joinChallenge(req.params.id,userId);
      res.status(200).json({ status: "success", message:"You successfully joined challenge",challenge})
    }catch(error: any){
      res.status(500).json({ message: `${error?.message}` });
      throw new AppError(`${error?.message}`, 500);
    }
  }

   /**
   * @swagger
   * /challenge/total-participants:
   *  get:
   *   summary: Get total number of participants
   *   description: Retrieve the total number of participants in all challenges.
   *   responses:
   *     200:
   *       description: Total number of participants retrieved successfully
   *     500:
   *       description: Internal Server Error
   */

  public static getTotalParticipants = async (req: Request, res: Response) => {
    try {
      const totalParticipants = await ChallengeService.getTotalParticipants();
      res.status(200).json({ totalParticipants });
    } catch (error: any) {
      res.status(500).json({ message: `${error?.message}` });
    }
  };
  
}
