"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import {
  LoginSchema,
  RegisterSchema,
  registerSchema,
  UserSchema,
} from "../validationSchemas";
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
    return {
      success: false,
      message: "Invalid data submitted.",
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
  previousState: { message: string } | undefined,
  data: LoginSchema
) => {
  const { username, password } = data;

  try {
    await signIn("credentials", { username, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid Credentials",
          };
        default:
          return { message: "Something went wrong" };
      }
    }
    throw error;
  }
};

export const updateUser = async (
  previousState: { success: boolean; message: string },
  data: UserSchema
) => {
  const { id, username, email, name, password, image, isAdmin } = data;

  const session = await auth();
  if (!id && !session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await connectToDB();
    const updateFields: { [key: string]: string | boolean | undefined } = {
      username,
      email,
      name,
      password,
      image,
      isAdmin: isAdmin === "true",
    };

    // remove empty or undefined values
    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || updateFields[key] === undefined) &&
        delete updateFields[key]
    );

    // hash password if it exist
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    await User.findByIdAndUpdate(id || session!.user.id, {
      $set: updateFields,
    });

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
  data: RegisterSchema
) => {
  const { username, email, name, password, image, isAdmin } = data;

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

export const deleteUser = async (
  previousState: { success: boolean; message: string },
  formData: FormData
) => {
  const id = formData.get("id") as string;

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
