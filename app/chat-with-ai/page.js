'use client'
import { useState } from "react";
import Tools from "../pages/Tools";

export default function ChatApp() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there 👋, How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Got it! Let me help you with that." },
      ]);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-between h-screen gap-1 bg-[#0a0929] p-2">
      <div className="bg-[#0e0e0f38] border border-gray-800 w-full max-w-[25rem] h-full rounded-2xl p-2">
        <Tools />
      </div>
      <div className="w-full h-full max-w-7xl rounded-2xl shadow-2xl bg-[#0e0e0f38] p-6 text-white border border-gray-800 flex flex-col justify-between ">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-sky-500 to-indigo-500  rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold">💬</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">Hi there, User</h1>
          <p className="text-gray-400">How can I help you today?</p>
        </div>

        {/* Chat Box */}
        <div className="h-full overflow-y-auto space-y-3 mb-4 p-3 bg-gray-900 rounded-xl border border-gray-800">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${
                  msg.sender === "user"
                    ? "bg-orange-500 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 h-12 focus:h-24 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500  font-semibold hover:scale-105 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
