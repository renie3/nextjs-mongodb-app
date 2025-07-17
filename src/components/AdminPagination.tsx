"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ITEM_PER_PAGE } from "@/lib/constants";

const AdminPagination = ({ totalData }: { totalData: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const router = useRouter();

  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < totalData;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between gap-1 mt-2">
      <button
        className="bg-gray-200 dark:bg-gray-600 py-1 px-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasPrev}
        onClick={() => router.push(createPageURL(page - 1))}
      >
        Prev
      </button>
      <div className="flex items-center gap-1">
        {Array.from(
          { length: Math.ceil(totalData / ITEM_PER_PAGE) },
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <button
                key={pageIndex}
                className={`hover:bg-gray-200 hover:dark:bg-gray-600 rounded-md h-8 w-8 cursor-pointer ${
                  page === pageIndex ? "bg-gray-200 dark:bg-gray-600" : ""
                }`}
                onClick={() => {
                  router.push(createPageURL(pageIndex));
                }}
              >
                {pageIndex}
              </button>
            );
          }
        )}
      </div>
      <button
        className="bg-gray-200 dark:bg-gray-600 py-1 px-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasNext}
        onClick={() => router.push(createPageURL(page + 1))}
      >
        Next
      </button>
    </div>
  );
};

export default AdminPagination;
