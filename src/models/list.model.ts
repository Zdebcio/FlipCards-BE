import { model, Schema, Document } from 'mongoose';
import { List } from '@/interfaces/List.interface';

const listSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userID: {
      type: Schema.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

const ListModel = model<List & Document>('List', listSchema);

export default ListModel;
