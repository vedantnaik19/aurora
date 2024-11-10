import { createContext, useCallback, useContext, useState } from "react";
import { api } from "../api";
import { Note } from "../types";

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;
  refreshNotes: () => void;
  refreshTrigger: number;
  fetchNotes: (researchId: string) => Promise<void>;
  addNote: (note: Omit<Note, "id">) => Promise<void>;
  deleteNote: (researchId: string, noteId: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | null>(null);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchNotes = useCallback(async (researchId: string) => {
    setLoading(true);
    try {
      const fetchedNotes = await api.getNotes(researchId);
      setNotes(fetchedNotes);
      setError(null);
    } catch (err) {
      setError("Failed to load notes");
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = useCallback(async (note: Omit<Note, "id">) => {
    await api.addNote(note);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const deleteNote = useCallback(async (researchId: string, noteId: string) => {
    await api.deleteNote(researchId, noteId);
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  }, []);

  const refreshNotes = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        refreshNotes,
        refreshTrigger,
        fetchNotes,
        addNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
