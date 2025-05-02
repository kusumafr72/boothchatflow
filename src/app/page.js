'use client';

import { useState, useRef, useEffect } from 'react';
import Link from "next/link";


export default function Home() {
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);

    // --- AVATAR MAPPING ---
  const avatarMap = {
      nova: '/assets/nova.png',
      onyx: '/assets/onyx.png',
      alloy: '/assets/alloy.png',
      echo: '/assets/echo.png',
      fable: '/assets/fable.png',
      shimmer: '/assets/shimmer.png',
  };
    
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  // Preload voices
  useEffect(() => {
    if (!synth) return;
    const load = () => synth.getVoices();
    synth.onvoiceschanged = load;
    load();
  }, [synth]);

  // auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // speak helper
  async function speak(text) {
    if (!text) return;
  
    try {
      setIsSpeaking(true); // Start pulsing
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });
  
      if (!res.ok) {
        console.error('TTS failed');
        setIsSpeaking(false);
        return;
      }
  
      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
  
      audio.onended = () => {
        setIsSpeaking(false); // Stop pulsing
      };
  
      audio.play();
    } catch (error) {
      console.error('Error playing TTS:', error);
      setIsSpeaking(false);
    }
  }
  

  // send message & get AI reply
  async function sendMessage(content, role = 'user') {
    setMessages(prev => [...prev, { role, content }]);
  
    if (role === 'user') {
      const savedKnowledge = JSON.parse(localStorage.getItem("knowledgeBase")) || [];
  
      const systemInstruction = `You are a helpful assistant. Do not start your response by saying "Assistant:". Only answer naturally.\n\n`;
      const knowledgeText = savedKnowledge.length
        ? `Here is some important background knowledge:\n- ${savedKnowledge.join("\n- ")}\n\n`
        : "";
  
      // Get the last 20 messages
      const recentMessages = [...messages, { role: 'user', content }].slice(-20);
  
      // Format them into conversation
      const conversationHistory = recentMessages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
  
      const fullPrompt = `${systemInstruction}${knowledgeText}Here is the conversation so far:\n${conversationHistory}\n\nNow answer the user.`;
  
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: fullPrompt }),
      });
  
      const { reply } = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      speak(reply);
    }
  }
  
  // form submit
  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  }

  // speech recognition
  function handleVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported');
      return;
    }
    const rec = new webkitSpeechRecognition();
    rec.lang = 'id-ID';
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = ev => {
      const text = ev.results[0][0].transcript;
      sendMessage(text, 'user');
      setInput('');
    };
    rec.start();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#181c2f] to-[#23263a] text-white font-poppins">
      {/* Top Bar */}
      <header className="w-full flex items-center justify-between px-10 py-4 bg-[#20243a] shadow-lg z-50">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold text-[#6c63ff]">Chatflow</span>
          <span className="ml-2 px-3 py-1 rounded-lg bg-gradient-to-r from-[#00e0ff] to-[#a259ff] text-white font-semibold text-sm">WhatsApp AI Assistant</span>
        </div>
        <Link href="/settings">
          <button className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-4 py-2 rounded-lg transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Settings
          </button>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="flex gap-6 items-center justify-center w-full max-w-[1800px] px-6">
          {/* Chat Box */}
          <div className="flex flex-col justify-between bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl shadow-2xl backdrop-blur-lg backdrop-saturate-150 flex-1 max-w-3xl h-[600px] min-w-[350px]">
            <div className="flex-1 overflow-y-auto p-8">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-5 py-3 rounded-2xl shadow-lg text-base font-medium transition-all duration-200
                      ${msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#a259ff] to-[#00e0ff] text-white shadow-[0_0_16px_#00e0ff55]'
                        : 'bg-[#23263a] text-[#ededed] border border-[#00e0ff33] shadow-[0_0_12px_#a259ff33]'}
                    `}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            {/* Input bar attached to chat */}
            <form
              onSubmit={handleSubmit}
              className="flex w-full gap-3 bg-[var(--glass)] border-t border-[var(--glass-border)] p-4 rounded-b-3xl shadow-2xl backdrop-blur-lg backdrop-saturate-150 z-50"
            >
              <button
                type="button"
                onClick={handleVoiceInput}
                className="p-4 bg-gradient-to-tr from-[#a259ff] to-[#00e0ff] rounded-full shadow-lg hover:from-[#00e0ff] hover:to-[#a259ff] transition-all duration-200 border-2 border-[#00e0ff]/40 text-xl"
              >
                🎙️
              </button>
              <input
                type="text"
                className="flex-1 p-4 rounded-xl bg-[#23263a] text-white focus:outline-none focus:ring-2 focus:ring-[#00e0ff] font-medium text-base border border-[#00e0ff22] shadow-inner backdrop-blur-md"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="p-4 bg-gradient-to-tr from-[#00e0ff] to-[#a259ff] rounded-full shadow-lg hover:from-[#a259ff] hover:to-[#00e0ff] transition-all duration-200 border-2 border-[#00e0ff]/40 text-xl"
              >
                ➤
              </button>
            </form>
          </div>

          {/* Avatar Box */}
          <div className="flex flex-col items-center justify-center bg-[var(--glass)] border border-[var(--glass-border)] rounded-3xl shadow-2xl backdrop-blur-lg backdrop-saturate-150 flex-1 max-w-3xl h-[600px] min-w-[350px] p-8">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="relative w-80 h-80 flex items-center justify-center">
                <img
                  src={avatarMap[selectedVoice]}
                  alt="AI Avatar"
                  className="relative w-full h-full rounded-full shadow-2xl object-cover"
                />
                {isListening && (
                  <div className="absolute inset-0 rounded-full border-8 border-[#a259ff] animate-pulse" />
                )}
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full border-8 border-[#00e0ff] animate-pulse" />
                )}
              </div>
              {/* Animated bar under avatar when speaking */}
              <div className="h-16 flex items-end justify-center w-full mt-8">
                {isSpeaking && (
                  <div className="flex gap-2 h-full items-end">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className="w-4 rounded bg-gradient-to-t from-[#00e0ff] to-[#a259ff] animate-wave"
                        style={{
                          height: `${Math.random() * 48 + 24}px`,
                          animationDelay: `${i * 0.08}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <footer className="w-full px-10 py-3 bg-[#20243a] text-center text-gray-400 text-sm font-medium shadow-lg z-50">
        © Chatflow - Asisten AI WhatsApp untuk Bisnis Anda
      </footer>
    </div>
  );
}
