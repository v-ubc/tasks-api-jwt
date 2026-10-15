
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signToken(user) {
  return jwt.sign({ email: user.email }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET, {
    algorithms: ['HS256'],
  });
}
