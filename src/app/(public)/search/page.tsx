import Posts from "@/components/Posts";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) => {
  const page = Number((await searchParams).page) || 1;
  const q = (await searchParams).q || "";

  return (
    <div>
      <h1 className="text-xl font-medium text-center mb-2">
        Search result for <b>{q}</b>
      </h1>
      <p className="text-center text-textSoft mb-8">
        Showing the most relevant posts based on your search query.
      </p>
      <Posts page={page} q={q} />
    </div>
  );
};

export default SearchPage;
