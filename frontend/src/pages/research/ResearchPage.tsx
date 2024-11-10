import { debounce } from "lodash-es";
import { useCallback, useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api";
import { NotesProvider } from "../../context/NotesContext";
import { ChatContainer } from "./ChatContainer";
import { AddSourceModal } from "./components/AddSourceModal";
import { NotesSidebar } from "./NotesSidebar";
import { SourcesSidebar } from "./SourcesSidebar";

export const ResearchPage: React.FC = () => {
  const { id: researchId } = useParams<{ id: string }>();
  const [researchName, setResearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);

  const debouncedUpdate = useCallback(
    (name: string) => {
      const updateName = async () => {
        if (!researchId) return;
        try {
          await api.updateResearch(researchId, name);
        } catch (error) {
          console.error("Error updating research name:", error);
        }
      };
      debounce(updateName, 500)();
    },
    [researchId]
  );

  useEffect(() => {
    const fetchResearch = async () => {
      if (!researchId) return;
      try {
        const research = await api.getResearch(researchId);
        setResearchName(research.title);
      } catch (error) {
        console.error("Error fetching research:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, [researchId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setResearchName(newName);
    debouncedUpdate(newName);
  };

  if (!researchId) {
    return <div>Invalid research ID</div>;
  }

  return (
    <NotesProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <header className="px-5 py-2 flex-none">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <FaHome size={22} className="text-gray-400 hover:text-gray-200" />
            </Link>
            <div className="flex flex-col">
              <input
                type="text"
                value={researchName}
                onChange={handleNameChange}
                disabled={loading}
                className="bg-transparent border-none p-2 text-xl font-medium text-gray-300 
                         focus:outline-none focus:ring-0 w-[360px]
                         placeholder-gray-600 disabled:opacity-50"
                placeholder="Untitled Research"
              />
            </div>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <SourcesSidebar />
          <main className="flex-1 flex bg-gray-900/10">
            <ChatContainer />
          </main>
          <NotesSidebar />
        </div>
        {researchId && (
          <AddSourceModal
            isOpen={isAddSourceModalOpen}
            onClose={() => setIsAddSourceModalOpen(false)}
            // onSourceAdded={() => setShouldRefreshSources(true)}
          />
        )}
      </div>
    </NotesProvider>
  );
};
