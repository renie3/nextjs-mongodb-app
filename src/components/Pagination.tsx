"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ITEM_PER_PAGE } from "@/lib/constants";

const Pagination = ({ totalData }: { totalData: number }) => {
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
    <div className="flex items-center justify-center gap-1 mt-5">
      <button
        className="hover:bg-bgSoft hover:rounded-md p-1.5 cursor-pointer disabled:hidden"
        disabled={!hasPrev}
        onClick={() => router.push(createPageURL(page - 1))}
      >
        <IoIosArrowBack size={20} />
      </button>
      <div className="flex items-center gap-1">
        {Array.from(
          { length: Math.ceil(totalData / ITEM_PER_PAGE) },
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <button
                key={pageIndex}
                className={`hover:bg-bgSoft rounded-md h-8 w-8 cursor-pointer ${
                  page === pageIndex ? "bg-bgSoft" : ""
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
        className="hover:bg-bgSoft hover:rounded-lg p-1.5 cursor-pointer disabled:hidden"
        disabled={!hasNext}
        onClick={() => router.push(createPageURL(page + 1))}
      >
        <IoIosArrowForward size={20} />
      </button>
    </div>
  );
};

export default Pagination;
