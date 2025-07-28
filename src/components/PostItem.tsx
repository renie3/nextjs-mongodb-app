import Link from "next/link";
import Image from "next/image";
import { format } from "timeago.js";
import { PostType } from "@/types/types";

const PostItem = ({ post }: { post: PostType }) => {
  return (
    <div className="h-[200px] flex flex-col gap-1">
      <Link href={`/posts/${post._id}`} className="h-3/4 relative">
        <Image
          src={post.img || "/noproduct.jpg"}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="h-full w-full rounded-xl"
        />
      </Link>
      <div className="h-1/4">
        <h1 className="text-lg font-medium">{post.title}</h1>
        <div className="flex items-center justify-between">
          <h2>{post.category}</h2>
          <span className="text-textSoft text-sm">
            {format(post.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
