"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deletePost } from "@/lib/actions/postActions";
import CreatePostForm from "./forms/CreatePostForm";
import UpdatePostForm from "./forms/UpdatePostForm";
import { PostType, UserType } from "@/types/types";
import { deleteUser } from "@/lib/actions/userActions";
import CreateUserForm from "./forms/CreateUserForm";
import UpdateUserForm from "./forms/UpdateUserForm";

type FormModalProps =
  | {
      table: "post";
      type: "create" | "update" | "delete";
      data?: PostType;
      id?: string;
    }
  | {
      table: "user";
      type: "create" | "update" | "delete";
      data?: UserType;
      id?: string;
    };

const deleteActionMap = {
  post: deletePost,
  user: deleteUser,
};

const FormModal = ({ table, type, data, id }: FormModalProps) => {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close form when click outside or esc
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const Form = () => {
    const [state, formAction, isPending] = useActionState(
      deleteActionMap[table],
      {
        success: false,
        message: "",
      }
    );

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        setOpen(false);
        toast.success(state.message);
        router.refresh();
      } else if (state.message) {
        toast.error(state.message);
      }
    }, [state, router]);

    if (type === "delete" && id) {
      return (
        <>
          <span className="text-center font-medium text-black mt-3 mb-1">
            Are you sure you want to delete this {table}?
          </span>
          <div className="flex items-center justify-center gap-3">
            <form action={formAction} className="flex flex-col items-center">
              <input type="hidden" name="id" value={id} />
              <button
                className="w-16 h-8 bg-red-500 dark:bg-red-700 text-white rounded-md cursor-pointer disabled:cursor-not-allowed"
                disabled={isPending}
              >
                {isPending ? <div className="spinner" /> : "Delete"}
              </button>
            </form>
            <button
              className="w-16 h-8 bg-gray-500 dark:bg-gray-700 text-white rounded-md cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </>
      );
    }

    if (type === "create" && table === "post")
      return <CreatePostForm setOpen={setOpen} />;
    if (type === "update" && table === "post" && data)
      return <UpdatePostForm setOpen={setOpen} post={data} />;

    if (type === "create" && table === "user")
      return <CreateUserForm setOpen={setOpen} />;
    if (type === "update" && table === "user" && data)
      return <UpdateUserForm setOpen={setOpen} user={data} />;

    return null;
  };

  return (
    <>
      <button
        className={`py-1 px-2 rounded-md cursor-pointer capitalize ${
          type === "create"
            ? "bg-blue-500 dark:bg-blue-700 text-white"
            : type === "update"
            ? "bg-green-500 dark:bg-green-700 text-white"
            : "bg-red-500 dark:bg-red-700 text-white"
        }`}
        onClick={() => setOpen(true)}
      >
        {type}
      </button>
      {open && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center">
          <div
            className="bg-white rounded-lg p-5 flex flex-col gap-2 relative"
            ref={modalRef}
          >
            <button
              className="text-black cursor-pointer absolute top-2 right-3"
              onClick={() => setOpen(false)}
            >
              X
            </button>
            <Form />
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
