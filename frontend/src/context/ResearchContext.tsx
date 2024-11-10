import { createContext, useCallback, useContext, useState } from "react";
import { api } from "../api";
import { Research } from "../types";

interface ResearchContextType {
  currentResearch: Research | null;
  researchList: Research[];
  totalItems: number;
  loading: boolean;
  createResearch: () => Promise<Research>;
  fetchResearch: (id: string) => Promise<void>;
  fetchAllResearch: (page: number, pageSize: number) => Promise<void>;
  deleteResearch: (id: string) => Promise<void>;
  updateResearch: (id: string, title: string) => Promise<void>;
}

const ResearchContext = createContext<ResearchContextType | undefined>(
  undefined
);

export const ResearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentResearch, setCurrentResearch] = useState<Research | null>(null);
  const [researchList, setResearchList] = useState<Research[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const createResearch = useCallback(async () => {
    const research = await api.createResearch();
    setResearchList((prev) => [...prev, research]);
    return research;
  }, []);

  const fetchResearch = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const research = await api.getResearch(id);
      setCurrentResearch(research);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllResearch = useCallback(
    async (page: number, pageSize: number) => {
      setLoading(true);
      try {
        const data = await api.getAllResearch(page, pageSize);
        setResearchList(data.items);
        setTotalItems(data.total);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteResearch = useCallback(async (id: string) => {
    await api.deleteResearch(id);
    setResearchList((prev) => prev.filter((item) => item.id !== id));
    setTotalItems((prev) => prev - 1);
  }, []);

  const updateResearch = useCallback(async (id: string, title: string) => {
    const updated = await api.updateResearch(id, title);
    setCurrentResearch(updated);
    setResearchList((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
  }, []);

  return (
    <ResearchContext.Provider
      value={{
        currentResearch,
        researchList,
        totalItems,
        loading,
        createResearch,
        fetchResearch,
        fetchAllResearch,
        deleteResearch,
        updateResearch,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = () => {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error("useResearch must be used within a ResearchProvider");
  }
  return context;
};
