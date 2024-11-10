import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useResearch } from "../../context/ResearchContext";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const {
    researchList,
    totalItems,
    loading,
    fetchAllResearch,
    deleteResearch,
  } = useResearch();

  useEffect(() => {
    fetchAllResearch(currentPage, pageSize);
  }, [currentPage, fetchAllResearch]);

  const handleDelete = async (e: React.MouseEvent, researchId: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this research?")) {
      try {
        await deleteResearch(researchId);
      } catch (error) {
        console.error("Error deleting research:", error);
      }
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div
      className={`flex flex-col h-full bg-gray-800 max-w-full transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64 sm:w-72"
      }`}
    >
      <div className="flex items-center p-2 sm:p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <FaChevronRight className="text-gray-400" size={16} />
          ) : (
            <FaChevronLeft className="text-gray-400" size={16} />
          )}
        </button>

        {!isCollapsed && (
          <h2 className="ml-3 text-base sm:text-lg font-semibold truncate text-gray-200">
            History
          </h2>
        )}
      </div>

      <div
        className={`flex-1 flex flex-col gap-2 p-2 sm:p-4 transition-opacity duration-300 ease-in-out ${
          isCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        {loading ? (
          <div className="text-gray-500 text-sm p-2">Loading...</div>
        ) : (
          <>
            {researchList.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/research/${item.id}`)}
                className="group p-2 rounded hover:bg-gray-700 cursor-pointer transition-colors text-sm sm:text-base flex items-center justify-between"
              >
                <span className="truncate">{item.title}</span>
                {!isCollapsed && (
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-opacity"
                    aria-label="Delete research"
                  >
                    <FaTrash
                      className="text-gray-400 hover:text-red-300"
                      size={12}
                    />
                  </button>
                )}
              </div>
            ))}
            {researchList.length === 0 && (
              <div className="text-gray-500 text-sm p-2">
                No research items yet
              </div>
            )}
          </>
        )}
      </div>

      {!isCollapsed && totalPages > 1 && (
        <div className="flex justify-between items-center p-2 sm:p-4 border-t border-gray-800">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
