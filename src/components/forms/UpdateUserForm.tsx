"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { IoCloudUploadOutline } from "react-icons/io5";
import { updateUser } from "@/lib/actions/userActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserSchema } from "@/lib/validationSchemas";
import { CloudinaryResultInfo, UserType } from "@/types/types";

const UpdateUserForm = ({
  setOpen,
  user,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserType;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<CloudinaryResultInfo | null>(
    user?.image ? { secure_url: user.image } : null
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [state, formAction, isPending] = useActionState(updateUser, {
    success: false,
    message: "",
  });

  const isCredentials = !!user?.username;

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema(isCredentials)),
    defaultValues: {
      username: user?.username ?? "",
      email: user?.email ?? "",
      name: user?.name ?? "",
      isAdmin: user?.isAdmin ? "true" : "false",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      formAction({ ...data, image: file?.secure_url });
    });
  });

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      toast.success(state.message);
      router.refresh();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router, setOpen]);

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-5 w-[280px] text-black"
    >
      <h1 className="text-lg font-medium text-center">Update User</h1>
      <input type="hidden" value={user._id || ""} {...register("id")} />
      {isCredentials && (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <input
              className="p-3 border border-borderColor rounded-md w-full"
              id="username"
              {...register("username")}
              ref={(el) => {
                // console.log(el);
                inputRef.current = el;
                register("username").ref(el);
              }}
            />
            {errors.username?.message && (
              <p className="text-red-500 text-sm">{errors.username?.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              className="p-3 border border-borderColor rounded-md w-full"
              id="email"
              {...register("email")}
            />
            {errors.email?.message && (
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            )}
          </div>
        </>
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
      <div>
        <label htmlFor="isAdmin">Admin</label>
        <select
          className="ml-2 p-2 border border-borderColor rounded-md"
          id="isAdmin"
          {...register("isAdmin")}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        {errors.isAdmin?.message && (
          <p className="text-red-500 text-sm">{errors.isAdmin?.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        {(file?.secure_url || user?.image) && (
          <Image
            src={file?.secure_url || user.image || ""}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 object-cover rounded-full mb-1 self-center"
          />
        )}
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
          onSuccess={(result, { widget }) => {
            setFile(result.info as CloudinaryResultInfo);
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
        {isPending ? <div className="spinner" /> : "Update"}
      </button>
    </form>
  );
};

export default UpdateUserForm;
