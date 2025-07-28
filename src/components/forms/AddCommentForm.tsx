"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const AddCommentForm = ({ postId }: { postId: string }) => {
  const [desc, setDesc] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const emojiRef = useRef<HTMLDivElement | null>(null);

  const handleEmojiClick = (e: EmojiClickData) => {
    setDesc((prev) => prev + e.emoji);
    inputRef.current?.focus();
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    if (!openEmoji) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setOpenEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openEmoji]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment: { postId: string; desc: string }) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
        newComment
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setDesc("");
      setOpenEmoji(false);
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ postId, desc });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input type="hidden" name="postId" value={postId ?? ""} />
      <input
        className="text-sm border-b border-borderColor w-full pb-1"
        type="text"
        name="desc"
        placeholder="Add a comment..."
        required
        onChange={(e) => setDesc(e.target.value)}
        value={desc}
        ref={inputRef}
      />
      <div className="flex items-center justify-between">
        {/* emoji */}
        <div className="relative" ref={emojiRef}>
          <div
            className="cursor-pointer text-xl"
            onClick={() => setOpenEmoji((prev) => !prev)}
          >
            😊
          </div>
          {openEmoji && (
            <div className="absolute left-0 bottom-16">
              <EmojiPicker height={350} onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        <button
          className="w-21 h-8 bg-blue-500 dark:bg-blue-700 text-white rounded-md mt-2 cursor-pointer disabled:cursor-not-allowed"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <div className="spinner" /> : "Comment"}
        </button>
      </div>
    </form>
  );
};

export default AddCommentForm;
