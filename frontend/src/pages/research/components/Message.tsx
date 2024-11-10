import { FaBookmark, FaUser } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { ChatMessage } from "../../../types";

interface MessageProps {
  message: ChatMessage;
  onSaveNote: (content: string) => void;
}

export const Message = ({ message, onSaveNote }: MessageProps) => (
  <div
    className={`flex ${
      message.role === "user" ? "justify-end" : "justify-start"
    } w-full`}
  >
    <div
      className={`flex gap-3 items-start max-w-[85%] ${
        message.role === "user" ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`w-8 h-8  rounded-full flex items-center justify-center flex-shrink-0 bg-gray-700`}
      >
        {message.role === "user" ? (
          <FaUser size={14} className="text-white" />
        ) : (
          <span className="text-md logo-gradient">🌟</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div
          className={`p-3 px-5 rounded-2xl bg-gray-800/50 text-gray-300 break-words whitespace-pre-wrap
          ${message.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {message.role === "assistant" && (
          <button
            title="Save to notes"
            className="self-start p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-full"
            onClick={() => onSaveNote(message.content)}
          >
            <FaBookmark size={12} />
          </button>
        )}
      </div>
    </div>
  </div>
);
