import { namingReg } from '@/utils/regex';
import { TypeOf, z } from 'zod';
import { PaginationSchema } from './pagination.schema';

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

export const GetUserListsSchema = PaginationSchema.extend({
  name: z.string().trim().optional(),
});

export type GetUserListsType = TypeOf<typeof GetUserListsSchema>;

export const GetListSchema = z.object({
  listID: z.string().trim(),
});

export type GetListType = TypeOf<typeof GetListSchema>;
