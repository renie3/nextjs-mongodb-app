"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const DeleteCommentModal = ({
  setOpenDelete,
  id,
  postId,
}: {
  setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  postId: string;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close form when click outside or esc
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpenDelete(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDelete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [setOpenDelete]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setOpenDelete(false);
      toast.success(res.data);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error((error.response?.data as string) || "Something went wrong");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  return (
    <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center">
      <div
        className="bg-white rounded-lg p-5 flex flex-col gap-2 relative"
        ref={modalRef}
      >
        <button
          className="text-black cursor-pointer absolute top-2 right-3"
          onClick={() => setOpenDelete(false)}
        >
          X
        </button>
        <span className="text-center font-medium text-black mt-3 mb-1">
          Are you sure you want to delete this comment?
        </span>
        <div className="self-center flex gap-3">
          <button
            className="w-16 h-8 bg-red-500 dark:bg-red-700 text-white rounded-md cursor-pointer disabled:cursor-not-allowed"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <div className="spinner" /> : "Delete"}
          </button>
          <button
            className="w-16 h-8 bg-gray-500 dark:bg-gray-700 text-white rounded-md cursor-pointer"
            onClick={() => setOpenDelete(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteCommentModal;
