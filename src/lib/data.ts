import connectToDB from "./connectToDB";
import { FilterQuery, SortOrder } from "mongoose";
import { IPost, Post } from "./models/post.model";
import { ITEM_PER_PAGE } from "./constants";
import { IUser, User } from "./models/user.model";

export const getPosts = async (
  page?: number,
  search?: string,
  category?: string,
  sort?: string
) => {
  const currentPage = page || 1;

  try {
    await connectToDB();

    const query: FilterQuery<IPost> = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const sortOption: Record<string, SortOrder> =
      sort === "popular" ? { visit: -1 } : { createdAt: -1 };

    const posts = await Post.find(query)
      // .sort(sort === "popular" ? { visit: -1 } : { createdAt: -1 })
      .sort(sortOption)
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (currentPage - 1));

    const totalPosts = await Post.countDocuments(query);

    return { posts: JSON.parse(JSON.stringify(posts)), totalPosts };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch posts!");
  }
};

export const getPost = async (id: string) => {
  try {
    await connectToDB();

    const post = await Post.findById(id).populate("user", "name image");
    return post;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch post!");
  }
};

export const getRelatedPosts = async (category: string, postId: string) => {
  try {
    await connectToDB();

    const posts = await Post.find({ category, _id: { $ne: postId } })
      .sort({ createdAt: -1 })
      .limit(4);

    return posts;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch post!");
  }
};

export const getFeaturedPosts = async () => {
  try {
    await connectToDB();

    const posts = await Post.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(3);

    return posts;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch post!");
  }
};

export const getUsers = async (
  page?: number,
  search?: string,
  userId?: string
) => {
  const currentPage = page || 1;

  try {
    await connectToDB();

    const query: FilterQuery<IUser> = { _id: { $ne: userId } };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (currentPage - 1));

    const totalUsers = await User.countDocuments(query);

    return { users: JSON.parse(JSON.stringify(users)), totalUsers };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch users!");
  }
};
