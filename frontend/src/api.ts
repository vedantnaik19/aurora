import { API_BASE_URL } from "./config";
import {
  ChatMessage,
  ChatResponse,
  Note,
  PaginatedResearch,
  Research,
  Source,
} from "./types";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers =
      options?.body instanceof FormData
        ? options?.headers
        : {
            "Content-Type": "application/json",
            ...options?.headers,
          };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`API call failed: ${errorText}`);
    }

    return response.json();
  }

  async createResearch() {
    return this.fetch<{ id: string; title: string }>("/research", {
      method: "POST",
    });
  }

  async getAllResearch(page: number = 1, pageSize: number = 10) {
    return this.fetch<PaginatedResearch>(
      `/research?page=${page}&page_size=${pageSize}`
    );
  }

  async updateResearch(id: string, title: string) {
    return this.fetch<Research>(`/research/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    });
  }

  async getResearch(id: string) {
    return this.fetch<Research>(`/research/${id}`);
  }

  async addLinkSource(researchId: string, url: string): Promise<Source> {
    const data = await this.fetch<{ reference_id: string }>(
      `/research/${researchId}/sources/link`,
      {
        method: "POST",
        body: JSON.stringify({ url }),
      }
    );
    return {
      reference_id: data.reference_id,
      type: "link" as const,
      url,
      research_id: researchId,
    };
  }

  async addFileSource(researchId: string, files: File[]): Promise<Source[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await this.fetch<{
      files: { reference_id: string; filename: string; research_id: string }[];
    }>(`/research/${researchId}/sources/files`, {
      method: "POST",
      body: formData,
    });

    return response.files.map((file) => ({
      reference_id: file.reference_id,
      type: "file" as const,
      research_id: file.research_id,
      filename: file.filename,
    }));
  }

  async getSources(researchId: string): Promise<Source[]> {
    return this.fetch<Source[]>(`/research/${researchId}/sources`);
  }

  async deleteSource(researchId: string, referenceId: string): Promise<void> {
    await this.fetch(`/research/${researchId}/sources/${referenceId}`, {
      method: "DELETE",
    });
  }

  async deleteResearch(id: string): Promise<void> {
    await this.fetch(`/research/${id}`, {
      method: "DELETE",
    });
  }

  async getAllChat(id: string) {
    return this.fetch<ChatMessage[]>(`/chat/${id}`);
  }

  async sendMessage(research_id: string, message: string) {
    return this.fetch<ChatResponse>(`/chat`, {
      method: "POST",
      body: JSON.stringify({ research_id: research_id, query: message }),
    });
  }

  async addNote(note: Omit<Note, "id">) {
    return this.fetch<Note>(`/note`, {
      method: "POST",
      body: JSON.stringify({
        research_id: note.research_id,
        title: note.title,
        content: note.content,
      }),
    });
  }

  async getNotes(research_id: string) {
    return this.fetch<Note[]>(`/notes/${research_id}`, {});
  }

  async deleteNote(research_id: string, note_id: string): Promise<void> {
    await this.fetch(`/note/${research_id}/${note_id}`, {
      method: "DELETE",
    });
  }

  async getSuggestions(research_id: string) {
    return this.fetch<ChatResponse>(`/chat/suggestions/${research_id}`);
  }
}

export const api = new ApiClient(API_BASE_URL);
