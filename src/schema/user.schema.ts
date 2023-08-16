import { passwordReg } from '@/utils/regex';
import { z } from 'zod';

export const UserSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8)
    .refine(value => {
      console.log(passwordReg.test(value));
      return passwordReg.test(value);
    }, 'Password is too weak'),
});
