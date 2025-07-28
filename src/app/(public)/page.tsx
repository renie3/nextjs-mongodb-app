import Link from "next/link";
import Posts from "@/components/Posts";
// import FeaturedPosts from "@/components/FeaturedPosts";

const categories = [
  { label: "All", value: "" },
  { label: "General", value: "general" },
  { label: "Technology", value: "technology" },
  { label: "Health", value: "health" },
  { label: "Sports", value: "sports" },
  { label: "Education", value: "education" },
];

const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) => {
  const page = Number((await searchParams).page) || 1;
  const category = (await searchParams).category || "";

  return (
    <div>
      <h1 className="text-xl font-medium text-center">All Post</h1>
      <div className="flex gap-3 my-5">
        {categories.map((item) => (
          <Link
            key={item.value}
            href={item.value ? `/?category=${item.value}` : "/"}
            className={`w-25 rounded-md font-bold text-center text-white ${
              category === item.value
                ? "bg-blue-700 dark:bg-blue-900"
                : "bg-blue-500 dark:bg-blue-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <Posts page={page} category={category} />
      {/* <FeaturedPosts /> */}
    </div>
  );
};

export default HomePage;
