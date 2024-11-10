import { debounce } from "lodash-es";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api";
import { useNotes } from "../../context/NotesContext";
import { Note } from "../../types";
import { NoteItem } from "./components/NoteItem";
import { ViewNoteModal } from "./components/ViewNoteModal";

export const NotesSidebar = () => {
  const { id: researchId } = useParams<{ id: string }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { refreshTrigger } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const debouncedSearch = useCallback((query: string) => {
    debounce(() => {
      setSearchQuery(query);
    }, 300)();
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!researchId) return;

      try {
        setIsLoading(true);
        const fetchedNotes = await api.getNotes(researchId);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [researchId, refreshTrigger]);

  const handleDelete = async (note: Note) => {
    if (!researchId) return;

    try {
      await api.deleteNote(researchId, note.id);
      setNotes(notes.filter((n) => n.id !== note.id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-96 h-full flex flex-col">
      <div className="p-4 space-y-3">
        <h2 className="font-medium text-gray-400">Saved Notes</h2>

        <input
          type="text"
          placeholder="Search notes..."
          className="input input-sm w-full p-2"
          onChange={(e) => debouncedSearch(e.target.value)}
          defaultValue={searchQuery}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        {isLoading ? (
          <div className="text-center text-gray-400 mt-4">Loading notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center text-gray-500 text-sm mt-4">
            {searchQuery ? "No matching notes found" : "No notes yet"}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotes.map((note, index) => (
              <NoteItem
                key={index}
                note={note}
                onDelete={() => handleDelete(note)}
                onClick={() => {
                  setSelectedNote(note);
                  setIsViewModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <ViewNoteModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
      />
    </div>
  );
};
