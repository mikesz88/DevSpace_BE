import { z } from 'zod';

export const LoginUserZObject = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

export type LoginUserType = z.infer<typeof LoginUserZObject>;

export const RegisterUserZObject = z
  .object({
    email: z.string().email(),
  })
  .strict();

export type RegisterUserType = z.infer<typeof RegisterUserZObject>;

export const jwtInfoSchema = z.object({
  id: z.string(),
  iat: z.number(),
  exp: z.number(),
});

export const UpdatePartOneZObject = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    jobTitle: z.string(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .strict();

export type UpdatePartOneType = z.infer<typeof UpdatePartOneZObject>;

export const UpdatePartTwoZObject = z
  .object({
    backgroundColor: z.string(),
    complimentingColor: z.string(),
    favSlogan: z.string(),
    favMusic: z.string(),
    avatar: z.string().min(8),
    biography: z.string().min(8),
  })
  .strict();

export type UpdatePartTwoType = z.infer<typeof UpdatePartTwoZObject>;
