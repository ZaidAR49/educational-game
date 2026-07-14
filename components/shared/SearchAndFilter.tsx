"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchAndFilterProps {
  placeholder?: string;
  showStatusFilter?: boolean;
}

export function SearchAndFilter({ 
  placeholder = "ابحث...", 
  showStatusFilter = false 
}: SearchAndFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      
      // Only navigate if search changed
      if (searchParams.get("search") !== searchTerm && (searchTerm || searchParams.has("search"))) {
        // Reset page on search change
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, searchParams]);

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 mt-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showStatusFilter && (
        <select
          className="block w-full sm:w-48 py-3 px-4 border border-gray-200 bg-white rounded-xl focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-gray-700 font-medium cursor-pointer"
          value={searchParams.get("status") || ""}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">كل الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
          <option value="archived">مؤرشف</option>
        </select>
      )}
    </div>
  );
}
