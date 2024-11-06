import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { smallSpinner } from '../stocks/spinner'

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading,
  maxPageNumbers = 5 // You can control how many pages to show at once
}) {
  // Calculate the range of page numbers to display
  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2))
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1)

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  )

  return (
    <div className="flex items-center sm:overflow-x-auto max-w-sm-[320px] justify-end mt-4 space-x-1">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || !!loading}
        className={`p-1 ${currentPage === 1 || !!loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'} transition-all`}
      >
        <ChevronLeftIcon className="size-4 text-gray-500" />
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1 overflow-auto">
        {startPage > 1 && (
          <button
            onClick={() => onPageChange(1)}
            disabled={!!loading || currentPage === 1}
            className={`px-2 py-1 border rounded text-sm ${
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-100'
            } transition-all`}
          >
            1
          </button>
        )}
        {startPage > 2 && <span className="px-1 text-sm">...</span>}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={!!loading || currentPage === page} // Prevent clicking the selected page
            className={`px-2 py-1 border rounded text-sm ${
              currentPage === page
                ? 'bg-[#3B86F7] text-white font-semibold cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-100'
            } transition-all`}
          >
            {/* Show loading indicator if loading equals the current page */}
            {loading === page ? smallSpinner : page}
          </button>
        ))}

        {endPage < totalPages - 1 && <span className="px-1 text-sm">...</span>}
        {endPage < totalPages && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={!!loading || currentPage === totalPages}
            className={`px-2 py-1 border rounded text-sm ${
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-100'
            } transition-all`}
          >
            {totalPages}
          </button>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || !!loading}
        className={`p-1 ${currentPage === totalPages || !!loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'} transition-all`}
      >
        <ChevronRightIcon className="size-4 text-gray-500" />
      </button>
    </div>
  )
}
