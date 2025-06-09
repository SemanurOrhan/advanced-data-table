import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "./ui/button"
import Select from "./ui/select"

export default function Pagination({ currentPage, totalPages, pageSize, totalResults, onPageChange, onPageSizeChange }) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always include first page
      pages.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 3) {
        end = 4
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis-start")
      }

      // Add pages in range
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis-end")
      }

      // Always include last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()
  const pageSizeOptions = [10, 20, 50, 100]

  // Calculate range of results being displayed
  const startResult = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endResult = Math.min(currentPage * pageSize, totalResults)

  // Sayfa boyutu değiştiğinde API'den yeni veri çekilmesi için App.jsx'de pageSize kullanılmalı

  return (
    <div className="bg-white rounded-xl shadow-card border border-border p-4 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
        <div className="text-sm text-muted font-medium text-center md:text-left">
          Showing <span className="font-semibold text-gray-900">{startResult}</span> to{" "}
          <span className="font-semibold text-gray-900">{endResult}</span> of{" "}
          <span className="font-semibold text-gray-900">{totalResults}</span> results
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full md:w-auto justify-center md:justify-end">
          <div className="flex items-center w-full sm:w-auto justify-center sm:justify-end">
            <span className="text-sm text-muted mr-2 font-medium hidden sm:inline">Rows per page:</span>
            <Select value={pageSize.toString()} onChange={e => onPageSizeChange(Number(e.target.value))} className="w-20 h-9 border-border focus:border-primary focus:ring-primary rounded-xl">
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center space-x-1 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="h-9 w-9 border-border hover:bg-accent hover:border-primary"
            >
              <ChevronLeft className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
            </Button>

            <div className="flex items-center">
              {pageNumbers.map((page, index) => {
                if (page === "ellipsis-start" || page === "ellipsis-end") {
                  return (
                    <span key={`${page}-${index}`} className="px-2 py-1 text-muted text-sm">
                      ...
                    </span>
                  )
                }

                const isActive = currentPage === page;
                return (
                  <Button
                    key={`page-${page}`}
                    variant={isActive ? undefined : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className={`h-8 w-8 mx-0.5 transition-all duration-150
                      ${isActive
                        ? "bg-primary/90 border-2 border-primary text-white font-extrabold shadow-lg ring-2 ring-primary/40 z-10"
                        : "border-border text-gray-700 hover:bg-accent hover:border-primary"}
                    `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              aria-label="Next page"
              className="h-9 w-9 border-border hover:bg-accent hover:border-primary"
            >
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
