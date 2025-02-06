/* eslint-disable react/prop-types */

const TablePagination = ({ count, currentPage, setCurrentPage }) => {
    const totalPages = Math.ceil(count / 10); // 10 items per page

    const getPaginationRange = () => {
        const range = [];
        if (totalPages <= 5) {
            // Showing all pages if total pages are less than 5
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            // Always show first, last, current, and two neighbors with "..."
            if (currentPage <= 3) {
                range.push(1, 2, 3, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                range.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
            } else {
                range.push(1, "...", currentPage, "...", totalPages);
            }
        }
        return range;
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-4 pb-4">
            <nav aria-label="Page navigation">
                <ul className="inline-flex -space-x-px text-base h-10">
                    {/* Previous Button */}
                    <li>
                        <button
                            className={`px-3 py-2 border rounded-md ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-200"}`}
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </button>
                    </li>

                    {/* Page Numbers */}
                    {getPaginationRange().map((page, index) => (
                        <li key={index}>
                            {page === "..." ? (
                                <span className="px-3">...</span>
                            ) : (
                                <button
                                    className={`px-3 py-2 border rounded-md ${currentPage === page ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            )}
                        </li>
                    ))}

                    {/* Next Button */}
                    <li>
                        <button
                            className={`px-3 py-2 border rounded-md ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-gray-200"}`}
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default TablePagination;
