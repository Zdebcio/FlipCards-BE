import { SortDirection } from '@/types/Sort.types';
import { z, TypeOf } from 'zod';

export const PaginationSchema = z.object({
  skip: z.coerce.number().int().min(0).optional(),
  limit: z.coerce.number().int().min(0).optional(),
  sort: z.nativeEnum(SortDirection).optional(),
  sortBy: z.string().optional(),
});

export type PaginationType = TypeOf<typeof PaginationSchema>;
