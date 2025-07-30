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
import { updatePost } from "@/lib/actions/postActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostSchema } from "@/lib/validationSchemas";
import { CloudinaryResultInfo, PostType } from "@/types/types";

const UpdatePostForm = ({
  setOpen,
  post,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostType;
}) => {
  const [file, setFile] = useState<CloudinaryResultInfo | null>(
    post?.img ? { secure_url: post.img } : null
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [state, formAction, isPending] = useActionState(updatePost, {
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
    defaultValues: {
      title: post.title,
      desc: post.desc,
      category: post.category,
      isFeatured: post.isFeatured ? "true" : "false",
    },
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
      <h1 className="text-lg font-medium text-center">Update Post</h1>
      <input type="hidden" value={post._id || ""} {...register("id")} />
      <div className="flex flex-col gap-1">
        <label htmlFor="title">Title</label>
        <input
          className="p-3 border border-borderColor rounded-md w-full"
          id="title"
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
      <div className="flex flex-col gap-1">
        <label htmlFor="desc">Description</label>
        <input
          className="p-3 border border-borderColor rounded-md w-full"
          id="desc"
          {...register("desc")}
        />
        {errors.desc?.message && (
          <p className="text-red-500 text-sm">{errors.desc?.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select
          className="ml-2 p-2 border border-borderColor rounded-md"
          id="category"
          {...register("category")}
        >
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
        <label htmlFor="isFeatured">Featured</label>
        <select
          className="ml-2 p-2 border border-borderColor rounded-md"
          id="isFeatured"
          {...register("isFeatured")}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        {errors.isFeatured?.message && (
          <p className="text-red-500 text-sm">{errors.isFeatured?.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        {(file?.secure_url || post?.img) && (
          <Image
            src={file?.secure_url || post.img || ""}
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

export default UpdatePostForm;
