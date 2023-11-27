import { SortOrder } from 'mongoose';

export default interface SortObject {
  [key: string]: SortOrder;
}
