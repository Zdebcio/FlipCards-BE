import { model, Schema, Document } from 'mongoose';
import { List } from '@/interfaces/List.interface';

const listSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const ListModel = model<List & Document>('List', listSchema);

export default ListModel;
