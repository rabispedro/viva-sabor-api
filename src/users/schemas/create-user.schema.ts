import { z } from 'zod';

export const CreateUserSchema = z
  .object({
    name: z.string(),
    birthDate: z.date(),
    email: z.string(),
    phone: z.string().length(11),
  })
  .required();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
