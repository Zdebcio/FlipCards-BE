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

export const GetListsSchema = PaginationSchema.extend({
  name: z.string().trim().optional(),
});

export type GetListsType = TypeOf<typeof GetListsSchema>;

export const GetListSchema = PaginationSchema.extend({
  forwardText: z.string().trim().optional(),
  backwardText: z.string().trim().optional(),
  listID: z.string().trim(),
});

export type GetListType = TypeOf<typeof GetListSchema>;
