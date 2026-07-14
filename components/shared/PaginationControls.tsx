"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-2 pt-4">
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
        >
          السابق
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 text-gray-700 opacity-50 cursor-not-allowed"
        >
          السابق
        </button>
      )}
      
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1;
          const isActive = currentPage === pageNumber;
          
          return (
            <Link
              key={pageNumber}
              href={createPageURL(pageNumber)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                isActive 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
        >
          التالي
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 text-gray-700 opacity-50 cursor-not-allowed"
        >
          التالي
        </button>
      )}
    </div>
  );
}
