import { z } from 'zod';

export const UpdateUserSchema = z
  .object({
    name: z.string(),
    birthDate: z.date(),
    email: z.string(),
    phone: z.string(),
  })
  .required();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
