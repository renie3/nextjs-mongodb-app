"use server";

import connectToDB from "../connectToDB";
import { Post } from "../models/post.model";
import { postSchema } from "../validationSchemas";
import { auth } from "../auth";
import { Comment } from "../models/comment.model";

export const createPost = async (
  previousState: { success: boolean; message: string },
  data: unknown
) => {
  const validatedFields = postSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "",
    };
  }

  const { title, desc, img, category, isFeatured } = validatedFields.data;

  const session = await auth();
  if (!session?.user?.isAdmin) {
    return {
      success: false,
      message: "Admin only",
    };
  }

  try {
    await connectToDB();

    const existingTitle = await Post.findOne({ title });
    if (existingTitle) {
      return {
        success: false,
        message: "Title already exists",
      };
    }

    await Post.create({
      user: session.user.id,
      title,
      desc,
      img,
      category,
      isFeatured: isFeatured === "true",
    });

    return { success: true, message: "Post has been created" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const updatePost = async (
  previousState: { success: boolean; message: string },
  data: unknown
) => {
  const validatedFields = postSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "",
    };
  }

  const { id, title, desc, img, category, isFeatured } = validatedFields.data;

  const session = await auth();
  if (!session?.user?.isAdmin) {
    return {
      success: false,
      message: "Admin only",
    };
  }

  try {
    await connectToDB();

    const existingTitle = await Post.findOne({ title });
    if (existingTitle && existingTitle._id.toString() !== id) {
      return {
        success: false,
        message: "Title is already taken",
      };
    }

    await Post.findByIdAndUpdate(id, {
      title,
      desc,
      img,
      category,
      isFeatured: isFeatured === "true",
    });

    return { success: true, message: "Post has been updated" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const deletePost = async (
  previousState: { success: boolean; message: string },
  formData: FormData
) => {
  const id = formData.get("id") as string;

  const session = await auth();
  if (!session?.user?.isAdmin) {
    return {
      success: false,
      message: "Admin only",
    };
  }

  if (!id) {
    return {
      success: false,
      message: "Invalid post ID",
    };
  }

  try {
    await connectToDB();

    await Post.findByIdAndDelete(id);
    // Delete all comments linked to this post
    await Comment.deleteMany({ post: id });

    return { success: true, message: "Post has been deleted" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
