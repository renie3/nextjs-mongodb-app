import Posts from "@/components/Posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Most Popular",
  description: "most popular Description",
};

const MostPopularPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const page = Number((await searchParams).page) || 1;

  return (
    <div>
      <h1 className="text-xl font-semibold text-center mb-2">
        🌟 Most Popular Posts
      </h1>
      <p className="text-center text-textSoft mb-8">
        Browse the latest and most popular posts in real-time.
      </p>
      <Posts page={page} sort="popular" />
    </div>
  );
};

export default MostPopularPage;
