import mongoose from 'mongoose';

export type User = {
  _id: mongoose.Types.ObjectId; 
  name: string;
  email: string;
  password: string;
  role: "talent" | "admin";
};
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}


export type ChallengeData = {
  title: string;
  deadline: string;
  prize: string;
  contactEmail: string;
  description: string;
  brief: string;
  deliverables: string;
  requirements: string;
  startTime: string;
};