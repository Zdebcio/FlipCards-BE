import { model, Schema, Document } from 'mongoose';
import { User } from '@/interfaces/User.interface';

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const UserModel = model<User & Document>('User', userSchema);

export default UserModel;
