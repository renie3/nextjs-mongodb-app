"use client";

import { FaSearch } from "react-icons/fa";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const AdminSearch = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams);

      params.set("page", "1");

      if (e.target.value) {
        params.set("search", e.target.value);
      } else {
        params.delete("search");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    300
  );

  return (
    <div className="border border-borderColor p-1 flex items-center justify-between rounded-2xl">
      <div className="px-2 dark:text-gray-400">
        <FaSearch />
      </div>
      <input
        className="w-full bg-transparent"
        type="text"
        placeholder={placeholder}
        onChange={handleSearch}
        defaultValue={searchParams.get("search")?.toString()}
      />
    </div>
  );
};

export default AdminSearch;
