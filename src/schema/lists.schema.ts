import { namingReg } from '@/utils/regex';
import { TypeOf, z } from 'zod';

export const CreateListSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .nonempty('Name is required')
    .max(20, 'The value is too long. The maximum number of characters is 20')
    .refine(value => {
      return namingReg.test(value);
    }, 'You can use only letters, numbers, spaces, hyphens, underscores and apostrophes'),
});

export const GetUserListsSchema = z.object({
  name: z
    .string()
    .trim()
    .max(20, 'The value is too long. The maximum number of characters is 20')
    .refine(value => {
      return namingReg.test(value);
    }, 'You can use only letters, numbers, spaces, hyphens, underscores and apostrophes'),
});

export type GetUserListsType = TypeOf<typeof GetUserListsSchema>;