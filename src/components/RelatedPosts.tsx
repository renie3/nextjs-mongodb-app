import { getRelatedPosts } from "@/lib/data";
import PostItem from "./PostItem";
import { PostType } from "@/types/types";

const RelatedPosts = async ({
  category,
  postId,
}: {
  category: string;
  postId: string;
}) => {
  const relatedPosts: PostType[] = await getRelatedPosts(category, postId);

  return (
    <div className="min-h-[245px]">
      <h1 className="text-xl font-semibold mb-2">Related Post</h1>
      {relatedPosts.length === 0 ? (
        <p className="text-textSoft">No related posts found.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {relatedPosts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
export default RelatedPosts;
