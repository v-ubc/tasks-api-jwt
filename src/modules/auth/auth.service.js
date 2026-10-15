import bcrypt from 'bcryptjs';
import { signToken } from '../../lib/jwt.js';
import { env } from '../../config/env.js';
import { HttpError } from '../../utils/http-error.js';

export function createAuthService(usersRepository) {
  return {
    async register({ email, password }) {
      const existing = await usersRepository.findByEmail(email);

      if (existing) {
        throw HttpError.conflict('El email ya esta registrado');
      }

      const passwordHash = await bcrypt.hash(password, 10);

      return usersRepository.create({
        email,
        passwordHash,
      });
    },

    async login({ email, password }) {
      const user = await usersRepository.findByEmail(email);

      const valid = user &&
        (await bcrypt.compare(password, user.password_hash));

      if (!valid) {
        throw HttpError.unauthorized('Credenciales invalidas');
      }

      return {
        accessToken: signToken(user),
        tokenType: 'Bearer',
        expiresIn: env.JWT_EXPIRES_IN,
      };
    },
  };
}
