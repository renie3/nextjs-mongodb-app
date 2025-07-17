"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CldUploadWidget } from "next-cloudinary";
import { register } from "@/lib/actions/userActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "@/lib/validationSchemas";
import { CloudinaryResultInfo } from "@/types/types";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState<CloudinaryResultInfo | null>(null);

  const [state, formAction, isPending] = useActionState(register, {
    success: false,
    message: "",
  });

  const router = useRouter();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit((data) => {
    // console.log({ ...data, image: avatar?.secure_url });
    startTransition(() => {
      formAction({ ...data, image: avatar?.secure_url });
    });
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/login");
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 w-[280px]">
      <h1 className="text-lg font-medium text-center">Register</h1>
      <div>
        <input
          className="p-3 border border-borderColor rounded-md w-full"
          placeholder="username"
          autoFocus
          {...registerForm("username")}
        />
        {errors.username?.message && (
          <p className="text-red-500 text-sm">{errors.username?.message}</p>
        )}
      </div>
      <div>
        <input
          className="p-3 border border-borderColor rounded-md w-full"
          type="email"
          placeholder="email"
          {...registerForm("email")}
        />
        {errors.email?.message && (
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        )}
      </div>
      <div>
        <input
          className="p-3 border border-borderColor rounded-md w-full"
          placeholder="name"
          {...registerForm("name")}
        />
        {errors.name?.message && (
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        )}
      </div>
      <div>
        <div className="p-3 border border-borderColor rounded-md flex items-center justify-between">
          <input
            className="w-full"
            type={showPassword ? "text" : "password"}
            placeholder="password"
            {...registerForm("password")}
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
      <div>
        <div className="p-3 border border-borderColor rounded-md flex items-center justify-between">
          <input
            className="w-full"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="password"
            {...registerForm("confirmPassword")}
          />
          <span
            className="cursor-pointer dark:text-textSoft"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? (
              <MdOutlineVisibility size={20} />
            ) : (
              <MdOutlineVisibilityOff size={20} />
            )}
          </span>
        </div>
        {errors.confirmPassword?.message && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword?.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        {avatar?.secure_url && (
          <Image
            src={avatar.secure_url}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 object-cover rounded-full mb-1 self-center"
          />
        )}
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
          // onSuccess={(result) => console.log(result)}
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

export default RegisterForm;
