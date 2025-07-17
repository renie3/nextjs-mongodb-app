import { NextRequest } from "next/server";
import connectToDB from "@/lib/connectToDB";
import { Comment } from "@/lib/models/comment.model";
import { CommentSchema } from "@/lib/validationSchemas";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const cursor = Number(searchParams.get("cursor")) || 0;
  const postId = searchParams.get("postId");

  const LIMIT = 2;
  try {
    await connectToDB();

    const comments = await Comment.find({ post: postId })
      .populate("user", "name image")
      .sort({ createdAt: -1 })
      .limit(LIMIT)
      .skip(cursor * LIMIT);

    const hasNextPage = comments.length === LIMIT;

    // await new Promise((resolve) => setTimeout(resolve, 2000));

    return new Response(
      JSON.stringify({ comments, nextCursor: hasNextPage ? cursor + 1 : null }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch comments!", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  // const { postId, desc } = body;

  const validatedFields = CommentSchema.safeParse(body);
  if (!validatedFields.success) {
    return new Response("Invalid input", { status: 400 });
  }

  const { postId, desc } = validatedFields.data;

  try {
    await connectToDB();

    await Comment.create({
      user: session.user.id,
      post: postId,
      desc,
    });

    return new Response("Comment has been created", { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create comment!", { status: 500 });
  }
}
