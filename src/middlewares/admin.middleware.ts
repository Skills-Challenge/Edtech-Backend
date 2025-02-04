import { Request, Response, NextFunction, RequestHandler } from 'express';

import AppError from '../utils/AppError';
import { User } from '../types';

interface AuthenticatedRequest extends Request {
    user?: User;
}

const restrictTo = (...roles: string[]): RequestHandler => {
    return (req, res, next) => {
        const typedReq = req as AuthenticatedRequest;
        if (!typedReq.user) {
            return next(new AppError("You are not logged in!", 401));
        }
        if (!typedReq.user || !roles.includes(typedReq.user.role)) {
            return next(new AppError("You don't have permission to perform this action", 403));
        }

        next();
    };
};

export default restrictTo;