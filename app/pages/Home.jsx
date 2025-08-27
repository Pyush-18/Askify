"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white flex flex-col">
      <header className="flex justify-between items-center px-6 py-4 md:px-10 md:py-6 border-b border-gray-800">
        <h1 className="text-3xl md:text-4xl font-extrabold">Askify</h1>
        <nav className="hidden md:flex gap-6 text-gray-200">
          <Link href="#" className="hover:text-sky-300 transition-colors duration-200">Home</Link>
          <Link href="/chat-with-ai" className="hover:text-sky-300 transition-colors duration-200">Chat</Link>
        </nav>
      </header>

      <section className="flex flex-col items-center text-center py-16 md:py-24 px-4 md:px-6">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6">
          AI-Powered Research Revolution
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-8 leading-relaxed">
          Unleash the potential of advanced AI with Askify. Instantly summarize papers, craft embeddings, and dive deep into knowledge.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => router.push("/chat-with-ai")}
            className="bg-gradient-to-r from-sky-500 to-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Dive In Now
          </button>
        </div>

        <div className="mt-12 md:mt-16 w-full max-w-5xl bg-gray-800 border border-gray-700 shadow-2xl rounded-2xl p-6 md:p-8 transform hover:scale-[1.02] transition-all duration-300">
          <h3 className="text-xl md:text-2xl font-bold mb-4">
            AI Research Notebook
          </h3>
          <ul className="text-gray-200 space-y-3 text-left">
            <li className="flex items-center gap-2"><span className="text-sky-400">•</span> Upload PDFs, websites, or YouTube videos</li>
            <li className="flex items-center gap-2"><span className="text-sky-400">•</span> Chat with AI using unified context</li>
            <li className="flex items-center gap-2"><span className="text-sky-400">•</span> Get instant summaries and insights</li>
            <li className="flex items-center gap-2"><span className="text-sky-400">•</span> Extract structured knowledge effortlessly</li>
          </ul>
        </div>
      </section>
    </div>
  );
}