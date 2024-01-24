import { TypeOf, z } from 'zod';
import { PaginationSchema } from './pagination.schema';

export const CreateFlashcardSchema = z.object({
  forwardText: z
    .string({ required_error: 'Field is required' })
    .trim()
    .nonempty('Field is required')
    .max(250, 'The value is too long. The maximum number of characters is 250'),
  backwardText: z
    .string({ required_error: 'Field is required' })
    .trim()
    .nonempty('Field is required')
    .max(250, 'The value is too long. The maximum number of characters is 250'),
  listIDs: z
    .array(z.string())
    .min(1, 'Must be related to minimum 1 list')
    .refine(items => new Set(items).size === items.length, {
      message: 'Must be an array of unique IDs',
    }),
});

export type CreateFlashcardType = TypeOf<typeof CreateFlashcardSchema>;

export const GetListFlashcardsSchema = PaginationSchema.extend({
  forwardText: z.string().trim().optional(),
  backwardText: z.string().trim().optional(),
});

export type GetListFlashcardsType = TypeOf<typeof GetListFlashcardsSchema>;
