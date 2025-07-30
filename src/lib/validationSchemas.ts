import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { message: "Username must be at least 3 characters long!" })
      .max(20, { message: "Username must be at most 20 characters long!" }),
    email: z.email({ message: "Invalid email address" }),
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters long!" })
      .max(20, { message: "Name must be at most 20 characters long!" }),
    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long!" })
      .max(20, { message: "Password must be at most 20 characters long!" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." }),
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "Contain at least one special character.",
    // })
    confirmPassword: z.string().trim().optional(),
    image: z.string().optional(),
    isAdmin: z.enum(["true", "false"]).optional(),
  })
  .refine(
    (data) => {
      return !data.confirmPassword || data.password === data.confirmPassword;
    },
    {
      path: ["confirmPassword"],
      message: "Passwords do not match!",
    }
  );

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .max(20, { message: "Password must be at most 20 characters long!" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" })
    .optional(),
  email: z.email({ message: "Invalid email address" }).optional(),
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long!" })
    .max(20, { message: "Name must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .max(20, { message: "Password must be at most 20 characters long!" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .or(z.literal(""))
    .optional(),
  image: z.string().optional(),
  isAdmin: z.enum(["true", "false"]).optional(),
});

export type UserSchema = z.infer<typeof userSchema>;

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, { message: "Title is required" }),
  desc: z.string().trim().min(1, { message: "Desc is required" }),
  category: z.enum(["general", "technology", "health", "sports", "education"], {
    message: "Category is required",
  }),
  isFeatured: z.enum(["true", "false"]),
  img: z.string().optional(),
});

export type PostSchema = z.infer<typeof postSchema>;

export const CommentSchema = z.object({
  postId: z.string().optional(),
  desc: z.string().trim().min(1, { message: "Desc is required" }),
});
