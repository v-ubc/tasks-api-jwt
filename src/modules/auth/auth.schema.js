import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email())
    .meta({ example: 'ana@test.com' }),
  password: z.string().min(8).max(72)
    .meta({ example: 'supersecreta' }),
});
