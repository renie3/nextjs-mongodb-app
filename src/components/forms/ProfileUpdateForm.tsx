"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { Session } from "next-auth";
import Image from "next/image";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CldUploadWidget } from "next-cloudinary";
import { updateUser } from "@/lib/actions/userActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserSchema } from "@/lib/validationSchemas";
import { CloudinaryResultInfo } from "@/types/types";

const ProfileUpdateForm = ({ session }: { session: Session | null }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<CloudinaryResultInfo | null>(
    session?.user?.image ? { secure_url: session.user.image } : null
  );

  const [state, formAction, isPending] = useActionState(updateUser, {
    success: false,
    message: "",
  });

  const router = useRouter();

  const isCredentials = !!session?.user?.username;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema(isCredentials)),
    defaultValues: {
      username: session?.user?.username ?? "",
      name: session?.user?.name ?? "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      formAction({ ...data, image: avatar?.secure_url });
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setValue("password", "");
      router.refresh();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router, setValue]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 w-[280px]">
      <h1 className="text-lg font-medium text-center">Update</h1>
      {isCredentials && (
        <div className="flex flex-col gap-1">
          <label htmlFor="username">Username</label>
          <input
            className="p-3 border border-borderColor rounded-md w-full"
            id="username"
            autoFocus
            {...register("username")}
          />
          {errors.username?.message && (
            <p className="text-red-500 text-sm">{errors.username?.message}</p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="name">Name</label>
        <input
          className="p-3 border border-borderColor rounded-md w-full"
          id="name"
          {...register("name")}
        />
        {errors.name?.message && (
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        )}
      </div>
      {isCredentials && (
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <div className="p-3 border border-borderColor rounded-md flex items-center justify-between">
            <input
              className="w-full"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="password"
              {...register("password")}
            />
            <span
              className="cursor-pointer dark:text-textSoft"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <MdOutlineVisibility size={20} />
              ) : (
                <MdOutlineVisibilityOff size={20} />
              )}
            </span>
          </div>
          {errors.password?.message && (
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          )}
        </div>
      )}
      <div className="flex flex-col">
        {(avatar?.secure_url || session?.user?.image) && (
          <Image
            src={avatar?.secure_url || session?.user.image || ""}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 object-cover rounded-full mb-1 self-center"
          />
        )}
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
          onSuccess={(result, { widget }) => {
            setAvatar(result.info as CloudinaryResultInfo);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div
                className="flex items-center gap-2 cursor-pointer text-textSoft text-sm"
                onClick={() => open()}
              >
                <IoCloudUploadOutline size={20} />
                <span>Upload a photo</span>
              </div>
            );
          }}
        </CldUploadWidget>
      </div>
      <button
        className="p-3 bg-blue-500 dark:bg-blue-700 text-white rounded-md cursor-pointer disabled:cursor-not-allowed"
        disabled={isPending}
      >
        {isPending ? <div className="spinner" /> : "Submit"}
      </button>
    </form>
  );
};

export default ProfileUpdateForm;
