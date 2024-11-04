import { useState } from "react";
import { FaPaperPlane, FaUser } from "react-icons/fa";

const Message = ({ message }) => (
  <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
    <div
      className={`flex gap-3 items-start ${
        message.isUser ? "flex-row-reverse" : ""
      }`}
    >
      <span className="pt-1 text-gray-300">
        {message.isUser ? (
          <FaUser size={16} />
        ) : (
          <h1 className="text-xl">🌟</h1>
        )}
      </span>
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          message.isUser
            ? "bg-blue-600 text-gray-200"
            : "bg-gray-700 text-gray-200"
        } shadow-sm`}
      >
        {message.text}
      </div>
    </div>
  </div>
);

export const ChatContainer = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to Aurora! How can I help with your research today?",
      isUser: false,
    },
    { id: 2, text: "Hello!", isUser: true },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), text: inputMessage, isUser: true },
      ]);
      setInputMessage("");
    }
  };

  const suggestedActions = ["Create a study guide", "Summarize sources"];

  return (
    <div className="flex-grow flex flex-col h-full pt-4 px-4  text-white rounded-lg shadow-lg">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-900 rounded-t-lg shadow-md">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>

      <div className="px-3 py-4 bg-gray-900 border-t flex flex-col gap-3 border-gray-700">
        <span className="italic px-2 text-sm text-gray-300">Quick actions</span>

        <div className="flex flex-wrap gap-4 max-w-full overflow-x-hidden">
          {suggestedActions.map((action, index) => (
            <span
              key={index}
              className="flex-shrink-0 cursor-pointer px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
            >
              {action}
            </span>
          ))}
        </div>
        <form className="flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Aurora"
            className="flex-grow p-3 rounded-lg bg-gray-800 text-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-400 placeholder-gray-500 transition"
            aria-label="Message input"
          />
          <button
            type="submit"
            className="p-3 rounded-lg text-gray-200 bg-blue-600 hover:bg-blue-500 transition"
            aria-label="Send message"
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
