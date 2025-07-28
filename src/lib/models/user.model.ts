import { Schema, model, models } from "mongoose";

export interface IUser {
  username?: string;
  email: string;
  name: string;
  image?: string;
  password?: string;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = models?.User || model<IUser>("User", userSchema);
