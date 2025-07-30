import { Schema, Types, model, models } from "mongoose";

export interface IPost {
  user: Types.ObjectId;
  title: string;
  desc: string;
  img?: string;
  category: "general" | "technology" | "health" | "sports" | "education";
  isFeatured: boolean;
  visit: number;
}

const postSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: ["general", "technology", "health", "sports", "education"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    visit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Post = models?.Post || model<IPost>("Post", postSchema);
