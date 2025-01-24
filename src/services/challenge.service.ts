import cron = require('node-cron');
import Challenge from '../models/challenge.model';

type ChallengeData = {
  title: string;
  deadline: Date;
  duration: string;
  prize: string;
  contactEmail: string;
  description: string;
  brief: string;
  deliverables: string;
  requirements: string;
};

export default class ChallengeService {
  public static createChallenge = async (data: ChallengeData) => {
    const {
      title,
      deadline,
      duration,
      description,
      prize,
      contactEmail,
      brief,
      requirements,
      deliverables,
    } = data;
    try {
      const challenge = await Challenge.create({
        title,
        deadline,
        duration,
        prize,
        contactEmail,
        description,
        brief,
        requirements,
        deliverables,
      });
      return challenge;
    } catch (err: any) {
      console.error('Error creating challenge: ', err?.message);
      throw err;
    }
  };

  public static getChallengeById = async (id: string) => {
    try {
      const challenge = await Challenge.findById(id);
      return challenge;
    } catch (error: any) {
      throw error;
    }
  };

  public static getAllChallenges = async () => {
    try {
      const challenges = await Challenge.find();
      return challenges;
    } catch (error: any) {
      console.error('Error getting all challenges: ', error?.message);
      throw error;
    }
  };

  public static updateChallenge = async (id: string, data: ChallengeData) => {
    try {
      const challenge = await Challenge.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!challenge) {
        throw new Error('Challenge not found');
      }
    } catch (error: any) {
      console.error('Error updating challenge: ', error?.message);
      throw error;
    }
  };

  public static deleteChallenge = async (id: string) => {
    try {
      const challenge = await Challenge.findByIdAndDelete(id);
      if (!challenge) {
        throw new Error('Challenge not found');
      }
    } catch (error: any) {
      console.error('Error deleting challenge: ', error?.message);
      throw error;
    }
  };

  public static getChallengeStats = async () => {
    try {
      const stats = await Challenge.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      const formattedStats = stats.reduce((acc: any, stat: any) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {});

      return {
        totalOngoing: formattedStats.ongoing || 0,
        totalCompleted: formattedStats.completed || 0,
        totalOpen: formattedStats.open || 0,
      };
    } catch (error: any) {
      console.error('Error getting challenge stats: ', error?.message);
      throw error;
    }
  };

  public static updateChallengeStatus = async () => {
    cron.schedule('0 0 * * *', async () => {
      try {
        const now = new Date();

        await Challenge.updateMany(
          { deadline: { $lt: now }, status: { $ne: 'completed' } },
          { status: 'completed' },
        );

        await Challenge.updateMany(
          { deadline: { $gt: now }, status: { $ne: 'open' } },
          { status: 'open' },
        );
        console.log('Challenge statuses updated successfully.');
      } catch (error: any) {
        console.error('Error updating challenge status: ', error?.message);
        throw error;
      }
    });
  };
}

ChallengeService.updateChallengeStatus();
