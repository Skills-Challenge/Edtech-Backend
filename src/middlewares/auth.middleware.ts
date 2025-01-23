import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from "../models/user.model"

const isAuthenticated = async(req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const payload = verifyToken(token);


  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findById(payload.id);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.user = user;

  next();
};

export default isAuthenticated;
