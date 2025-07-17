export type PostType = {
  _id: string;
  title: string;
  desc: string;
  img?: string;
  category: "general" | "technology" | "health" | "sports" | "education";
  isFeatured: boolean;
  createdAt: string;
  user?: {
    name: string;
    image?: string;
  };
};

export type UserType = {
  _id: string;
  username?: string;
  name: string;
  email: string;
  image?: string;
  isAdmin: boolean;
  createdAt: string;
};

export type CommentType = {
  _id: string;
  post: string;
  desc: string;
  likes: string[];
  likesCount: number;
  dislikes: string[];
  dislikesCount: number;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
};

export type CloudinaryResultInfo = {
  secure_url: string;
};
