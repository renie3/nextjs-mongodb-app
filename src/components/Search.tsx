"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const [q, setQ] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setQ(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimQuery = q.trim();

    if (trimQuery) {
      router.push(`/search?q=${trimQuery}`);
    }
  };

  return (
    <form
      className="border border-borderColor w-1/4 lg:w-1/3 p-1 flex items-center justify-between rounded-lg"
      onSubmit={handleSearch}
    >
      <input
        className="w-full bg-transparent pl-2"
        type="text"
        placeholder="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button className="pr-1 dark:text-gray-400 cursor-pointer">
        <FaSearch />
      </button>
    </form>
  );
};

export default Search;
