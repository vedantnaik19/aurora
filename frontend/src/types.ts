export type SourceType = "link" | "file";

export interface Source {
  reference_id: string;
  type: SourceType;
  url?: string;
  filename?: string;
  research_id: string;
}

export interface Research {
  id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResearch {
  items: Research[];
  total: number;
}

export interface ChatResponse {
  response: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  research_id: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  research_id: string;
  created_at?: string;
  updated_at?: string;
}
