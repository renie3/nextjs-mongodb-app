"use server";

import { auth } from "../auth";
import connectToDB from "../connectToDB";
import { Post } from "../models/post.model";
import { PostSchema } from "../validationSchemas";

export const createPost = async (
  previousState: { success: boolean; message: string },
  data: PostSchema
) => {
  const { title, desc, img, category, isFeatured } = data;

  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
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
  data: PostSchema
) => {
  const { id, title, desc, img, category, isFeatured } = data;

  try {
    await connectToDB();

    await Post.findByIdAndUpdate(id, {
      $set: { title, desc, img, category, isFeatured: isFeatured === "true" },
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

  try {
    await connectToDB();

    await Post.findByIdAndDelete(id);

    return { success: true, message: "Post has been deleted" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
