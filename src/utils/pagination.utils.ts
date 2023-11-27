import defaultsConfig from '@/config/defaults.config';
import SortObject from '@/interfaces/Sort.interface';
import { PaginationType } from '@/schema/pagination.schema';
import { SortDirection } from '@/types/Sort.types';
import { FilterQuery } from 'mongoose';

export const generateSortObject = (sortField?: string, sortDirection?: SortDirection) => {
  const sortObject: SortObject = {};

  if (!sortField || !sortDirection) return null;

  sortObject[sortField] = sortDirection === SortDirection.desc ? -1 : 1;
  return sortObject;
};

export const applyPagination = <T>(query: FilterQuery<T>, options: Pick<PaginationType, 'limit' | 'skip'> = {}) => {
  const { skip, limit } = options;
  return query.skip(skip || defaultsConfig.skip).limit(limit || defaultsConfig.limit);
};

export const applySorting = <T>(query: FilterQuery<T>, { sortBy, sort }: Pick<PaginationType, 'sort' | 'sortBy'> = {}) => {
  return query.sort(generateSortObject(sortBy, sort));
};
