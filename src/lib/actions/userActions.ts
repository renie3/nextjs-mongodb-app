"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { loginSchema, registerSchema, userSchema } from "../validationSchemas";
import connectToDB from "../connectToDB";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export const handleGoogleLogin = async () => {
  await signIn("google", { redirectTo: "/" });
};

export const handleGithubLogin = async () => {
  await signIn("github", { redirectTo: "/" });
};

export const handleLogout = async () => {
  await signOut({ redirectTo: "/" });
};

export const register = async (
  previousState: { success: boolean; message: string },
  data: unknown
) => {
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "",
    };
  }

  const { username, email, name, password, image } = validatedFields.data;

  try {
    await connectToDB();

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return {
        success: false,
        message: "Username already exists",
      };
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    const existingName = await User.findOne({ name });
    if (existingName) {
      return {
        success: false,
        message: "Name already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      name,
      email,
      password: hashedPassword,
      image,
    });

    return { success: true, message: "You have registered successfully." };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const login = async (
  previousState: { success: boolean; message: string },
  data: unknown
) => {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "",
    };
  }

  const { username, password } = validatedFields.data;

  try {
    await signIn("credentials", { username, password, redirectTo: "/" });
    return { success: true, message: "" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid Credentials",
          };
        default:
          return { success: false, message: "Something went wrong" };
      }
    }
    throw error;
  }
};

export const updateUser = async (
  previousState: { success: boolean; message: string },
  data: unknown
) => {
  const validatedFields = userSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "",
    };
  }

  const { username, name, password, image } = validatedFields.data;

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await connectToDB();

    const existingUsername = await User.findOne({ username });
    if (existingUsername && existingUsername._id.toString() !== userId) {
      return {
        success: false,
        message: "Username is already taken",
      };
    }

    const existingName = await User.findOne({ name });
    if (existingName && existingName._id.toString() !== userId) {
      return {
        success: false,
        message: "Name is already taken",
      };
    }

    const updateFields: {
      username?: string;
      name?: string;
      image?: string;
      password?: string;
    } = {
      username,
      name,
      image,
    };

    // Hash password if provided and not just whitespace
    if (password && password.trim() !== "") {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    await User.findByIdAndUpdate(userId, updateFields);

    return { success: true, message: "User has been updated" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const createUser = async (
  previousState: { success: boolean; message: string },
  data: unknown
) => {
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "",
    };
  }

  const { username, email, name, password, image, isAdmin } =
    validatedFields.data;

  const session = await auth();
  if (!session?.user?.isAdmin) {
    return {
      success: false,
      message: "Admin only",
    };
  }

  try {
    await connectToDB();

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return {
        success: false,
        message: "Username already exists",
      };
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    const existingName = await User.findOne({ name });
    if (existingName) {
      return {
        success: false,
        message: "Name already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      name,
      email,
      password: hashedPassword,
      image,
      isAdmin: isAdmin === "true",
    });

    return { success: true, message: "User has been created" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const updateUserAdmin = async (
  previousState: { success: boolean; message: string },
  data: unknown
) => {
  const validatedFields = userSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "",
    };
  }

  const { id, username, email, name, password, image, isAdmin } =
    validatedFields.data;

  const session = await auth();
  if (!session?.user?.isAdmin) {
    return {
      success: false,
      message: "Admin only",
    };
  }
  try {
    await connectToDB();

    const existingUsername = await User.findOne({ username });
    if (existingUsername && existingUsername._id.toString() !== id) {
      return {
        success: false,
        message: "Username is already taken",
      };
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== id) {
      return {
        success: false,
        message: "Email is already taken",
      };
    }

    const existingName = await User.findOne({ name });
    if (existingName && existingName._id.toString() !== id) {
      return {
        success: false,
        message: "Name is already taken",
      };
    }

    const updateFields: {
      username?: string;
      email?: string;
      name?: string;
      image?: string;
      password?: string;
      isAdmin?: string;
    } = {
      username,
      email,
      name,
      image,
      isAdmin,
    };

    // Hash password if provided and not just whitespace
    if (password && password.trim() !== "") {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    await User.findByIdAndUpdate(id, updateFields);

    return { success: true, message: "User has been updated" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const deleteUser = async (
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
      message: "Invalid user ID",
    };
  }

  try {
    await connectToDB();

    await User.findByIdAndDelete(id);

    return { success: true, message: "User has been deleted" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
