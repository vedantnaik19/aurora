import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`flex flex-col h-full bg-gray-900 max-w-full p-0 transition-all duration-0 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <FaChevronRight size={20} />
          ) : (
            <FaChevronLeft size={20} />
          )}
        </button>

        {!isCollapsed && (
          <h2 className="ml-4 text-lg font-semibold">History</h2>
        )}
      </div>

      {!isCollapsed && (
        <div className="flex flex-col gap-2 p-4">
          <div className="p-2 rounded hover:bg-gray-800 cursor-pointer">
            Item 1
          </div>
          <div className="p-2 rounded hover:bg-gray-800 cursor-pointer">
            Item 2
          </div>
          <div className="p-2 rounded hover:bg-gray-800 cursor-pointer">
            Item 3
          </div>
          <div className="p-2 rounded hover:bg-gray-800 cursor-pointer">
            Item 4
          </div>
        </div>
      )}
    </div>
  );
};
