"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex justify-between items-center px-10 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Askify</h1>
        <nav className="hidden md:flex gap-8 text-gray-300">
          <Link href="#">Home</Link>
          <Link href="/chat-with-ai">Chat</Link>
        </nav>
        <div className="flex gap-4">
          <button className="text-gray-300">Login</button>
          <button className="bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 rounded-lg">
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-24 px-6">
        <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent mb-6">
          AI-Powered Research Solutions
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
          Unlock the power of large language models with Askify.
          Summarize papers, generate embeddings, and explore knowledge with AI.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/chat-with-ai")}
            className="bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 rounded-lg"
          >
            Get Started
          </button>
        </div>

        {/* Mockup Card */}
        <div className="mt-16 w-full max-w-4xl bg-gray-900 border border-gray-800 shadow-lg rounded-2xl p-8">
          <h3 className="text-lg font-semibold mb-4">AI Research Notebook</h3>
          <ul className="text-gray-400 space-y-2 text-left">
            <li>• Upload PDFs, website links, or YouTube videos as sources</li>
            <li>• Chat with AI using the combined context from all inputs</li>
            <li>• Get instant summaries, explanations, and insights</li>
            <li>• Extract structured knowledge and key takeaways</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
