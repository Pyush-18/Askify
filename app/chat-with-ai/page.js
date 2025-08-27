"use client";
import { useState, useRef, useEffect } from "react";
import Tools from "../pages/Tools";
import toast from "react-hot-toast";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ChatApp() {
  const [messages, setMessages] = useState([
    { sender: "AI", text: "Hi there 👋! I’m **Askify AI**, your genius guide. What can I help you with today? ✨", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("all"); 
  const chatBoxRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) {
      toast.error("Whoops! Type something to get the magic started! 😄");
      return;
    }

    const userMessage = { sender: "user", text: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/chat", { userQuery: input, filterType });
      if (!response.data || !response.data.reply) {
        throw new Error("Hmm, my magic wand failed! Try again? 😅");
      }
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: response.data.reply, timestamp: new Date() },
      ]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Oops, a glitch in the matrix! 😱";
      toast.error(`Error: ${errorMessage}`);
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "Sorry, I stumbled! Let’s try that again. ✨", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const clearChat = () => {
    setMessages([{ sender: "AI", text: "Hi there 👋! I’m **Askify AI**, your genius guide. What can I help you with today? ✨", timestamp: new Date() }]);
    toast.success("Chat wiped clean—ready for new adventures! 🚀");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen gap-4 md:gap-6 bg-gradient-to-br from-[#0a0929] via-[#1a1a4a] to-[#2a2a6a] p-2 md:p-4 lg:p-6">
      <div className="w-full md:w-auto md:max-w-[20rem] lg:max-w-[25rem] h-auto md:h-full rounded-2xl p-2 md:p-4 shadow-2xl bg-[#1a1a3a]/80 backdrop-blur-lg border border-gray-700/40 transform hover:scale-[1.01] transition-all duration-300">
        <Tools />
      </div>

      <div className="flex-1 h-full rounded-2xl bg-[#1a1a3a]/80 backdrop-blur-lg border border-gray-700/40 shadow-2xl flex flex-col overflow-hidden">
        <div className="text-center py-4 sm:py-5 md:py-6 px-2 sm:px-3 md:px-4 border-b border-gray-700/40 bg-gradient-to-r from-[#1a1a3a] to-[#2a2a6a]/50">
          <div className="w-14 sm:w-16 h-14 sm:h-16 mx-auto bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
            <span className="text-2xl sm:text-3xl font-bold">💡</span>
          </div>
          <h1 className="mt-2 sm:mt-3 text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
            Askify AI
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base">Unlock the secrets of your indexed universe! 🌌</p>
        </div>

        <div
          ref={chatBoxRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-5 bg-[#12122e]/60 rounded-t-2xl scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] md:max-w-[60%] p-3 sm:p-4 md:p-5 rounded-xl text-xs sm:text-sm md:text-base shadow-lg transform hover:scale-[1.02] transition-all duration-200 ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-none"
                    : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100 rounded-bl-none"
                }`}
              >
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={dracula}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg overflow-x-auto"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="text-green-300 bg-gray-900 px-1 rounded" {...props}>
                          {children}
                        </code>
                      );
                    },
                    p({ children }) {
                      return <p className="mb-1 sm:mb-2 last:mb-0">{children}</p>;
                    },
                    ul({ children }) {
                      return <ul className="list-disc list-inside mb-1 sm:mb-2">{children}</ul>;
                    },
                    ol({ children }) {
                      return <ol className="list-decimal list-inside mb-1 sm:mb-2">{children}</ol>;
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="max-w-[60%] p-3 sm:p-4 md:p-5 rounded-xl text-sm bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100 rounded-bl-none shadow-lg">
                Crafting your answer with a dash of magic... ✨
              </div>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 md:p-6 border-t border-gray-700/40 bg-[#1a1a3a]/60">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-auto px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-xl bg-[#2a2a5a]/60 text-white border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 text-sm shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              <option value="all">All Sources</option>
              <option value="youtube">YouTube</option>
              <option value="website">Website</option>
              <option value="pdf">PDF</option>
            </select>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && sendMessage()}
              placeholder="Ask me anything about your indexed world! 🌍"
              className="flex-1 px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-xl bg-[#2a2a5a]/60 text-white border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 placeholder-gray-400 text-sm shadow-md hover:shadow-lg"
              disabled={isLoading}
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-0 w-full sm:w-auto">
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className={`w-full sm:w-auto px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 font-semibold text-sm shadow-md hover:shadow-xl transition-all duration-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 sm:h-5 w-4 sm:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send"
                )}
              </button>
              <button
                onClick={clearChat}
                className="w-full sm:w-auto px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-xl bg-red-600 hover:bg-red-700 font-semibold text-sm shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}