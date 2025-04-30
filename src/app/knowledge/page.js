// app/knowledge/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function KnowledgePage() {
  const [knowledge, setKnowledge] = useState("");
  const [savedKnowledge, setSavedKnowledge] = useState([]);

  useEffect(() => {
    const existing = localStorage.getItem("knowledgeBase");
    if (existing) {
      setSavedKnowledge(JSON.parse(existing));
    }
  }, []);

  const handleSave = () => {
    if (!knowledge.trim()) return;
    const newKB = [...savedKnowledge, knowledge.trim()];
    setSavedKnowledge(newKB);
    localStorage.setItem("knowledgeBase", JSON.stringify(newKB));
    setKnowledge("");
  };

  const handleDelete = (index) => {
    const newKB = savedKnowledge.filter((_, i) => i !== index);
    setSavedKnowledge(newKB);
    localStorage.setItem("knowledgeBase", JSON.stringify(newKB));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-4 py-2 rounded-lg transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Chat
            </button>
          </Link>
        </div>

        {/* Page Title */}
        <h2 className="text-3xl font-bold mb-8 text-white">Knowledge Base</h2>

        {/* Input Area */}
        <div className="mb-8">
          <textarea
            value={knowledge}
            onChange={(e) => setKnowledge(e.target.value)}
            placeholder="Enter your knowledge here..."
            className="w-full h-32 p-4 rounded-lg bg-[#2a2a2a] text-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-[#4a4a4a] placeholder-gray-400 resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 mb-10 w-full sm:w-auto"
        >
          Save Knowledge
        </button>

        {/* Knowledge List */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-6 text-white">Saved Knowledge</h3>
          {savedKnowledge.length === 0 ? (
            <p className="text-gray-400">No knowledge saved yet.</p>
          ) : (
            <div className="space-y-4">
              {savedKnowledge.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-[#2a2a2a] p-4 rounded-lg hover:bg-[#3a3a3a] transition-all duration-200"
                >
                  <span className="text-gray-100 flex-1">{item}</span>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 ml-4"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
