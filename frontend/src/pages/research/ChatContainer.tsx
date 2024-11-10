import { useCallback, useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { api } from "../../api";
import { useNotes } from "../../context/NotesContext";
import { ChatMessage } from "../../types";
import { Message } from "./components/Message";
import { QuickActions } from "./components/QuickActions";
import { SaveNoteModal } from "./components/SaveNoteModal";
import { TypingIndicator } from "./components/TypingIndicator";

export const ChatContainer = () => {
  const { id: researchId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [saveNoteModal, setSaveNoteModal] = useState({
    isOpen: false,
    content: "",
  });
  const { refreshNotes } = useNotes();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number>(0);

  const fetchSuggestions = useCallback(async () => {
    if (!researchId) return;

    try {
      const response = await api.getSuggestions(researchId);
      const questions = response.response
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q.length > 0);
      setSuggestions(questions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, [researchId]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant") {
      const now = Date.now();
      if (now - lastMessageTimestamp >= 2000) {
        // 2 second cooldown
        fetchSuggestions();
        setLastMessageTimestamp(now);
      }
    }
  }, [messages, fetchSuggestions, lastMessageTimestamp]);

  useEffect(() => {
    if (!researchId) return;
    const fetchChatHistory = async () => {
      try {
        const chatHistory = await api.getAllChat(researchId);
        setMessages(chatHistory);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchChatHistory();
  }, [researchId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !researchId) return;

    setIsLoading(true);
    try {
      // Add user message immediately
      const userMessage: ChatMessage = {
        role: "user",
        content: inputMessage,
        research_id: researchId,
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");

      // Send message to API
      const response = await api.sendMessage(researchId, inputMessage);

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.response,
        research_id: researchId,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSaveNote = async (title: string, content: string) => {
    if (!researchId) return;
    try {
      await api.addNote({
        title,
        content,
        research_id: researchId,
      });
      refreshNotes(); // Refresh notes after successful save
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const quickActions = [
    "Create a study guide",
    "Summarize sources",
    "Create Q&A",
    ...suggestions,
  ];

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <TypingIndicator />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <div className="flex-1 relative">
        <div className="absolute inset-0 px-4">
          <div className="h-full overflow-y-auto py-6 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500">
                No messages yet. Start a conversation!
              </div>
            ) : (
              messages.map((message, index) => (
                <Message
                  key={index}
                  message={message}
                  onSaveNote={(content) =>
                    setSaveNoteModal({ isOpen: true, content })
                  }
                />
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 py-4 px-6 gap-2 max-w-4xl mx-auto w-full">
        <span className="p-2 pt-4 italic text-sm font-medium text-gray-400">
          Quick Actions
        </span>
        <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto p-2">
          {quickActions.map((action) => (
            <QuickActions
              key={action}
              text={action}
              onClick={() => setInputMessage(action)}
            />
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Aurora..."
            className="input flex-1 bg-gray-800/70 "
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="btn btn-primary"
          >
            <FaPaperPlane size={16} />
          </button>
        </form>
      </div>
      <SaveNoteModal
        isOpen={saveNoteModal.isOpen}
        onClose={() => setSaveNoteModal({ isOpen: false, content: "" })}
        content={saveNoteModal.content}
        onSave={handleSaveNote}
      />
    </div>
  );
};
