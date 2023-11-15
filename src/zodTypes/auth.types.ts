import { z } from 'zod';

export const LoginUser = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

export type LoginUserType = z.infer<typeof LoginUser>;

export const jwtInfoSchema = z.object({
  id: z.string(),
  iat: z.number(),
  exp: z.number(),
});
