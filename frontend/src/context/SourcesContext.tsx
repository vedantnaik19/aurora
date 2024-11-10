import { createContext, useCallback, useContext, useState } from "react";
import { api } from "../api";
import { Source } from "../types";

interface SourcesContextType {
  sources: Source[];
  loading: boolean;
  error: string | null;
  fetchSources: (researchId: string) => Promise<void>;
  addLinkSource: (researchId: string, url: string) => Promise<Source>;
  addFileSource: (researchId: string, files: File[]) => Promise<Source[]>;
  deleteSource: (researchId: string, sourceId: string) => Promise<void>;
}

const SourcesContext = createContext<SourcesContextType | undefined>(undefined);

export const SourcesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = useCallback(async (researchId: string) => {
    setLoading(true);
    try {
      const fetchedSources = await api.getSources(researchId);
      setSources(fetchedSources);
      setError(null);
    } catch (err) {
      setError("Failed to load sources");
      console.error("Error fetching sources:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addLinkSource = useCallback(async (researchId: string, url: string) => {
    return api.addLinkSource(researchId, url);
  }, []);

  const addFileSource = useCallback(
    async (researchId: string, files: File[]) => {
      return api.addFileSource(researchId, files);
    },
    []
  );

  const deleteSource = useCallback(
    async (researchId: string, sourceId: string) => {
      await api.deleteSource(researchId, sourceId);
      setSources((prev) =>
        prev.filter((source) => source.reference_id !== sourceId)
      );
    },
    []
  );

  return (
    <SourcesContext.Provider
      value={{
        sources,
        loading,
        error,
        fetchSources,
        addLinkSource, // Changed from addSource
        addFileSource,
        deleteSource,
      }}
    >
      {children}
    </SourcesContext.Provider>
  );
};

export const useSources = () => {
  const context = useContext(SourcesContext);
  if (!context) {
    throw new Error("useSources must be used within a SourcesProvider");
  }
  return context;
};
