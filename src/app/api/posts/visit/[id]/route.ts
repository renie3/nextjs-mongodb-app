import connectToDB from "@/lib/connectToDB";
import { Post } from "@/lib/models/post.model";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectToDB();

    await Post.findByIdAndUpdate(id, {
      $inc: { visit: 1 },
    });

    return new Response("View incremented", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to update post view!", { status: 500 });
  }
}
