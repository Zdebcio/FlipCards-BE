import { namingReg } from '@/utils/regex';
import { z } from 'zod';

export const CreateListSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .nonempty('Name is required')
    .max(20, 'The value is too long. The maximum number of characters is 20')
    .refine(value => {
      return namingReg.test(value);
    }, 'You can use only letters, numbers, spaces, hyphens, and underscores. Spaces cannot be used as the first or last character'),
});
