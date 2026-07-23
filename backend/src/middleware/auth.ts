import { Response, NextFunction, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { User, UserRole } from '../../../shared/src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'attendex_super_secret_jwt_key';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = decoded as User;
    next();
  });
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User context not found' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: requires one of the following roles: ${allowedRoles.join(', ')}` });
    }

    next();
  };
};

export const generateToken = (user: User): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
};
