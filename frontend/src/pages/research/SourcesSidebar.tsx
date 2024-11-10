import { useEffect, useState } from "react";
import { FaPlusCircle, FaTimes } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useSources } from "../../context/SourcesContext";
import { Source } from "../../types";
import { AddSourceModal } from "./components/AddSourceModal";

const getDisplayName = (source: Source): string => {
  if (!source) return "No name";

  try {
    if (source.type === "file") {
      return source.filename ?? "Unnamed file";
    }
    return source.url
      ? source.url.replace(/^https?:\/\//, "").replace("www.", "")
      : "Invalid URL";
  } catch (error) {
    console.error("Error getting source display name:", error);
    return "Invalid source";
  }
};

export const SourcesSidebar = () => {
  const { id: researchId } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sources, loading, error, fetchSources, deleteSource } = useSources();

  useEffect(() => {
    if (!researchId) return;
    fetchSources(researchId);
  }, [researchId, fetchSources]);

  const handleRemoveSource = async (id: string) => {
    if (!researchId) return;
    if (!window.confirm("Are you sure you want to remove this source?")) return;

    try {
      await deleteSource(researchId, id);
    } catch (err) {
      console.error("Error removing source:", err);
    }
  };

  return (
    <div className="w-72 h-full flex flex-col">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-gray-400">Sources</h3>
            <span className="text-xs text-gray-500">{sources.length}</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-secondary p-1.5 text-gray-400 bg-transparent rounded-full hover:bg-gray-800/50"
          >
            <FaPlusCircle size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        {loading ? (
          <div className="text-sm text-gray-500 text-center py-4">
            Loading...
          </div>
        ) : error ? (
          <div className="text-sm text-red-400 text-center py-4">{error}</div>
        ) : sources.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-4">
            No sources added yet
          </div>
        ) : (
          <div className="space-y-0.5">
            {sources.map((source) => (
              <div
                key={source.reference_id}
                className="group flex items-center justify-between px-2 py-2 hover:bg-gray-800/50 rounded-md transition-colors"
              >
                <span
                  className="truncate text-sm text-gray-300"
                  title={source.url || source.filename}
                >
                  {getDisplayName(source)}
                </span>
                <button
                  onClick={() => handleRemoveSource(source.reference_id)}
                  className="p-1 rounded-md hover:text-red-400 hover:bg-gray-700/50 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddSourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSourceAdded={() => researchId && fetchSources(researchId)}
      />
    </div>
  );
};
