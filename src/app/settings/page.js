'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [knowledge, setKnowledge] = useState("");
  const [savedKnowledge, setSavedKnowledge] = useState([]);

  useEffect(() => {
    // Load saved voice from localStorage
    const savedVoice = localStorage.getItem("selectedVoice");
    if (savedVoice) {
      setSelectedVoice(savedVoice);
    }

    // Load knowledge base
    const existing = localStorage.getItem("knowledgeBase");
    if (existing) {
      setSavedKnowledge(JSON.parse(existing));
    }
  }, []);

  const handleVoiceChange = (e) => {
    const voice = e.target.value;
    setSelectedVoice(voice);
    localStorage.setItem("selectedVoice", voice);
  };

  const handleSaveKnowledge = () => {
    if (!knowledge.trim()) return;
    const newKB = [...savedKnowledge, knowledge.trim()];
    setSavedKnowledge(newKB);
    localStorage.setItem("knowledgeBase", JSON.stringify(newKB));
    setKnowledge("");
  };

  const handleDeleteKnowledge = (index) => {
    const newKB = savedKnowledge.filter((_, i) => i !== index);
    setSavedKnowledge(newKB);
    localStorage.setItem("knowledgeBase", JSON.stringify(newKB));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#181c2f] to-[#23263a] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-4 py-2 rounded-lg transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Chat
              </button>
            </Link>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
        </header>

        {/* Voice Selection */}
        <div className="mb-8 bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl p-6 shadow-2xl backdrop-blur-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Voice Selection</h2>
          <select
            value={selectedVoice}
            onChange={handleVoiceChange}
            className="w-full bg-[#23263a] border border-[#00e0ff]/30 text-white px-4 py-3 rounded-xl shadow-lg font-semibold focus:ring-2 focus:ring-[#00e0ff] backdrop-blur-md"
          >
            <option value="nova">Nova</option>
            <option value="onyx">Onyx</option>
            <option value="alloy">Alloy</option>
            <option value="echo">Echo</option>
            <option value="fable">Fable</option>
            <option value="shimmer">Shimmer</option>
          </select>
        </div>

        {/* Knowledge Base */}
        <div className="bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl p-6 shadow-2xl backdrop-blur-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Knowledge Base</h2>
          <div className="mb-6">
            <textarea
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
              placeholder="Enter your knowledge here..."
              className="w-full h-32 p-4 rounded-xl bg-[#23263a] text-white focus:outline-none focus:ring-2 focus:ring-[#00e0ff] font-medium text-base border border-[#00e0ff22] shadow-inner backdrop-blur-md resize-none"
            />
            <button
              onClick={handleSaveKnowledge}
              className="mt-4 w-full bg-gradient-to-r from-[#00e0ff] to-[#a259ff] px-4 py-3 rounded-xl shadow-lg font-semibold text-white hover:from-[#a259ff] hover:to-[#00e0ff] transition-all duration-200 border border-[#00e0ff]/30 backdrop-blur-md"
            >
              Add Knowledge
            </button>
          </div>

          <div className="space-y-4">
            {savedKnowledge.length === 0 ? (
              <p className="text-gray-400 text-center">No knowledge saved yet.</p>
            ) : (
              savedKnowledge.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-[#23263a] p-4 rounded-xl hover:bg-[#2a2a2a] transition-all duration-200"
                >
                  <span className="text-white flex-1">{item}</span>
                  <button
                    onClick={() => handleDeleteKnowledge(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 ml-4"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 