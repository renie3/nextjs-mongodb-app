import { Schema, Types, model, models } from "mongoose";

export interface IComment {
  user: Types.ObjectId;
  post: Types.ObjectId;
  desc: string;
  likes: [Types.ObjectId];
  likesCount: number;
  dislikes: [Types.ObjectId];
  dislikesCount: number;
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    dislikesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Comment =
  models?.Comment || model<IComment>("Comment", commentSchema);
