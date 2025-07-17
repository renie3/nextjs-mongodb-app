"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { IoCloudUploadOutline } from "react-icons/io5";
import { createPost } from "@/lib/actions/postActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { postSchema, PostSchema } from "@/lib/validationSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudinaryResultInfo } from "@/types/types";

const CreatePostForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [file, setFile] = useState<CloudinaryResultInfo | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [state, formAction, isPending] = useActionState(createPost, {
    success: false,
    message: "",
  });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      formAction({ ...data, img: file?.secure_url });
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
      <h1 className="text-lg font-medium text-center">Create Post</h1>
      <div>
        <input
          className="p-3 border border-borderColor rounded-md w-full"
          placeholder="title"
          {...register("title")}
          ref={(el) => {
            // console.log(el);
            inputRef.current = el;
            register("title").ref(el);
          }}
        />
        {errors.title?.message && (
          <p className="text-red-500 text-sm">{errors.title?.message}</p>
        )}
      </div>
      <div>
        <input
          className="p-3 border border-borderColor rounded-md w-full"
          placeholder="desc"
          {...register("desc")}
        />
        {errors.desc?.message && (
          <p className="text-red-500 text-sm">{errors.desc?.message}</p>
        )}
      </div>
      <div>
        <select
          className="p-3 border border-borderColor rounded-md w-full"
          {...register("category")}
        >
          <option value="">Select Category</option>
          <option value="general">General</option>
          <option value="technology">Technology</option>
          <option value="health">Health</option>
          <option value="sports">Sports</option>
          <option value="education">Education</option>
        </select>
        {errors.category?.message && (
          <p className="text-red-500 text-sm">{errors.category?.message}</p>
        )}
      </div>
      <div>
        <select
          className="p-3 border border-borderColor rounded-md w-full"
          {...register("isFeatured")}
        >
          <option value="false">Is Featured?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        {errors.isFeatured?.message && (
          <p className="text-red-500 text-sm">{errors.isFeatured.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        {file?.secure_url && (
          <Image
            src={file.secure_url}
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
        {isPending ? <div className="spinner" /> : "Submit"}
      </button>
    </form>
  );
};

export default CreatePostForm;
