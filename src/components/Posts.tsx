import PostItem from "./PostItem";
import { getPosts } from "@/lib/data";
import Pagination from "./Pagination";
import { PostType } from "@/types/types";

const Posts = async ({
  page,
  q,
  category,
  sort,
}: {
  page: number;
  q?: string;
  category?: string;
  sort?: string;
}) => {
  const { posts, totalPosts }: { posts: PostType[]; totalPosts: number } =
    await getPosts(page, q, category, sort);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {posts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
      <Pagination totalData={totalPosts} />
    </>
  );
};

export default Posts;
