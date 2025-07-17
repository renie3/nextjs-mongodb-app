import { CommentType } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiDislike, BiSolidDislike } from "react-icons/bi";
import { toast } from "react-toastify";

const CommentInteractions = ({
  comment,
  userId,
  postId,
}: {
  comment: CommentType;
  userId?: string;
  postId: string;
}) => {
  const queryClient = useQueryClient();

  // like mutation
  const likeMutation = useMutation({
    mutationFn: () => {
      return axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/like/${comment._id}`
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
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

  const handleLike = () => {
    if (!userId) {
      toast.error("You are not authenticated");
      return;
    }

    likeMutation.mutate();
  };

  // dislike mutation
  const dislikeMutation = useMutation({
    mutationFn: () => {
      return axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/dislike/${comment._id}`
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
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

  const handleDislike = () => {
    if (!userId) {
      toast.error("You are not authenticated");
      return;
    }

    dislikeMutation.mutate();
  };

  return (
    <div className="flex items-center gap-3 mt-0.5">
      <div className="flex items-center gap-0.5 mb-1 w-7.5">
        <button
          className="cursor-pointer disabled:opacity-50"
          disabled={likeMutation.isPending}
          onClick={handleLike}
        >
          {userId && comment.likes.includes(userId) ? (
            <AiFillLike size={20} />
          ) : (
            <AiOutlineLike size={20} />
          )}
        </button>
        {comment.likesCount > 0 && (
          <span className="text-sm text-textSoft">{comment.likesCount}</span>
        )}
      </div>
      <div className="flex items-center gap-0.5 mb-1 w-7.5">
        <button
          className="cursor-pointer disabled:opacity-50"
          disabled={dislikeMutation.isPending}
          onClick={handleDislike}
        >
          {userId && comment.dislikes.includes(userId) ? (
            <BiSolidDislike size={20} />
          ) : (
            <BiDislike size={20} />
          )}
        </button>
        {comment.dislikesCount > 0 && (
          <span className="text-sm text-textSoft">{comment.dislikesCount}</span>
        )}
      </div>
    </div>
  );
};
export default CommentInteractions;
