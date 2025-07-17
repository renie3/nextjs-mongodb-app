import { auth } from "@/lib/auth";
import connectToDB from "@/lib/connectToDB";
import { Comment } from "@/lib/models/comment.model";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.id;

  try {
    await connectToDB();

    const comment = await Comment.findById(id);
    if (!comment) return new Response("Comment not found", { status: 404 });

    const hasLiked = comment.likes.some(
      (id: Types.ObjectId) => id.toString() === userId
    );
    const hasDisliked = comment.dislikes.some(
      (id: Types.ObjectId) => id.toString() === userId
    );

    if (!hasDisliked) {
      await Comment.findByIdAndUpdate(id, {
        $addToSet: { dislikes: userId },
        $inc: { dislikesCount: 1 },
      });

      // Remove like if present
      if (hasLiked) {
        await Comment.findByIdAndUpdate(id, {
          $pull: { likes: userId },
          $inc: { likesCount: -1 },
        });
      }
    } else {
      await Comment.findByIdAndUpdate(id, {
        $pull: { dislikes: userId },
        $inc: { dislikesCount: -1 },
      });
    }

    return new Response(
      !hasDisliked
        ? "Comment has been disliked"
        : "Comment dislike has been removed",
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response("Failed to update comment!", { status: 500 });
  }
}
