export const TypingIndicator = () => (
  <div className="flex items-center space-x-2 mx-4 w-min">
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
    <div
      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
      style={{ animationDelay: "0.2s" }}
    ></div>
    <div
      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
      style={{ animationDelay: "0.4s" }}
    ></div>
  </div>
);
