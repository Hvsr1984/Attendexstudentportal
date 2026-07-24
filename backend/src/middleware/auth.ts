import { Response, NextFunction, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { User, UserRole } from '../shared-types';
import { verifyFirebaseIdToken } from '../lib/firebaseAdmin';
import { db } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'attendex_super_secret_jwt_key';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // 1. First attempt standard Attendex JWT verification
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    req.user = decoded;
    return next();
  } catch (jwtErr) {
    // 2. If JWT fails, attempt Firebase ID Token verification
    try {
      const verifiedFirebaseUser = await verifyFirebaseIdToken(token);
      if (verifiedFirebaseUser && verifiedFirebaseUser.email) {
        const student = db.getStudentByEmail(verifiedFirebaseUser.email);
        if (student) {
          req.user = {
            id: student.id,
            email: student.email,
            name: student.name,
            role: 'student'
          };
          return next();
        }
      }
    } catch (firebaseErr) {
      // Fallthrough to 403 error
    }
  }

  return res.status(403).json({ error: 'Invalid or expired token' });
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
