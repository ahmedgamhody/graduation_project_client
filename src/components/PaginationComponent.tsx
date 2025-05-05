import { Pagination } from "flowbite-react";

interface IPaginationComponentProps {
  currentPage: number;
  pagesNumber: number;
  onPageChange: (page: number) => void;
}

export default function PaginationComponent({
  currentPage,
  pagesNumber,
  onPageChange,
}: IPaginationComponentProps) {
  return (
    <div className="pagination  mx-auto flex sm:justify-center mt-8">
      <Pagination
        currentPage={currentPage}
        totalPages={pagesNumber}
        onPageChange={onPageChange}
        showIcons
        theme={{
          pages: {
            base: "text-xs sm:text-sm flex items-center -space-x-px",
            showIcon: "inline-flex",
            previous: {
              base: "ml-0 mr-2 rounded-l-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
              icon: "h-3 w-3 sm:h-5 sm:w-5",
            },
            next: {
              base: " ml-2 mr-0 rounded-r-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
              icon: "h-3 w-3 sm:h-5 sm:w-5",
            },
            selector: {
              base: "w-7 h-7 sm:w-10 sm:h-10 border border-gray-300 bg-white leading-tight text-gray-500 text-xs sm:text-sm enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
              active:
                "bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
              disabled: "cursor-not-allowed opacity-50",
            },
          },
        }}
      />
    </div>
  );
}
