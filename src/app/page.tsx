"use client";

import { useState, useEffect } from "react";
import TarotCard from "../components/TarotCard";
import { TAROT_CARDS } from "../constants/cards";
import { TarotTopic, CardOrientation, TarotCardData, TarotReadingResponse } from "../types/tarot";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const TOPICS: TarotTopic[] = [
  "Tổng quan",
  "Tình cảm",
  "Sự nghiệp",
  "Tài chính",
  "Sức khỏe"
];

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length - 1) {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="whitespace-pre-line">{displayedText}</span>;
}

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState<TarotTopic>("Tổng quan");
  const [card, setCard] = useState<TarotCardData | null>(null);
  const [orientation, setOrientation] = useState<CardOrientation>("Upright");
  const [isRevealed, setIsRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<TarotReadingResponse | null>(null);
  const [error, setError] = useState("");

  const drawCard = async () => {
    // Reset state
    setIsRevealed(false);
    setReading(null);
    setError("");
    setLoading(false);

    // Randomize Card and Orientation
    const randomCard = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
    const randomOrientation = Math.random() > 0.5 ? "Upright" : "Reversed";
    
    setCard(randomCard);
    setOrientation(randomOrientation);

    // Small delay to ensure card is rendered before revealing
    setTimeout(() => {
      setIsRevealed(true);
      fetchReading(randomCard.name, randomOrientation);
    }, 500);
  };

  const fetchReading = async (cardName: string, cardOrientation: CardOrientation) => {
    setLoading(true);
    try {
      const response = await fetch("/api/tarot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          cardName: cardName,
          orientation: cardOrientation,
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể kết nối đến AI.");
      }

      const data = await response.json();
      setReading(data);
    } catch {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-[#f0f0f0] font-sans flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-[#D4AF37]/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto space-y-10"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif text-[#D4AF37] tracking-widest uppercase glow-text">
            AI Tarot Daily
          </h1>
          <p className="text-[#D4AF37]/70 text-sm md:text-base tracking-widest uppercase">
            Thông điệp vũ trụ dành cho bạn hôm nay
          </p>
        </div>

        {/* Topic Selector */}
        <div className="flex flex-wrap justify-center gap-3">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => {
                if (!loading) {
                  setSelectedTopic(topic);
                  setCard(null);
                  setIsRevealed(false);
                  setReading(null);
                }
              }}
              disabled={loading}
              className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                selectedTopic === topic
                  ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "border-[#D4AF37]/30 text-[#D4AF37]/60 hover:border-[#D4AF37]/60 hover:text-[#D4AF37]"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Draw Button */}
        {!isRevealed && !card && (
          <div className="flex justify-center pt-8">
            <button
              onClick={drawCard}
              className="px-8 py-4 rounded-lg bg-[#D4AF37] text-[#1a1a1a] font-bold text-lg font-serif tracking-widest uppercase hover:bg-[#F3E5AB] transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] transform hover:scale-105 active:scale-95"
            >
              Rút Bài
            </button>
          </div>
        )}

        {/* Card Display */}
        {card && (
          <div className="flex justify-center mt-12 mb-8">
            <TarotCard
              name={card.name}
              orientation={orientation}
              isRevealed={isRevealed}
            />
          </div>
        )}

        {/* Loading Indicator */}
        {loading && isRevealed && (
          <div className="flex flex-col items-center justify-center space-y-4 py-8 text-[#D4AF37]">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="font-serif tracking-widest text-sm animate-pulse uppercase">Vũ trụ đang truyền thông điệp...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-center py-4 p-4 border border-red-500/30 rounded-lg bg-red-500/10">
            {error}
          </div>
        )}

        {/* Reading Results */}
        <AnimatePresence>
          {reading && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto space-y-6 mt-8"
            >
              <div className="bg-[#1a1a1a] border border-[#D4AF37]/40 rounded-xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-[#D4AF37]/70 transition-colors">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[#D4AF37] font-serif text-xl tracking-wider mb-2 uppercase border-b border-[#D4AF37]/20 pb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block"></span>
                      Tổng Quan
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                      <TypewriterText text={reading.summary} />
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[#D4AF37] font-serif text-xl tracking-wider mb-2 uppercase border-b border-[#D4AF37]/20 pb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block"></span>
                      Phân Tích Sâu
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                      <TypewriterText text={reading.analysis} />
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[#D4AF37] font-serif text-xl tracking-wider mb-2 uppercase border-b border-[#D4AF37]/20 pb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block"></span>
                      Lời Khuyên
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                      <TypewriterText text={reading.advice} />
                    </p>
                  </div>

                  <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-4 rounded-lg mt-8 text-center italic">
                    <p className="text-[#D4AF37] font-serif text-lg">
                      &quot;<TypewriterText text={reading.affirmation} />&quot;
                    </p>
                  </div>
                </div>
                
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => {
                      setCard(null);
                      setIsRevealed(false);
                      setReading(null);
                    }}
                    className="text-[#D4AF37] text-sm uppercase tracking-widest border-b border-[#D4AF37]/50 pb-1 hover:border-[#D4AF37] hover:text-[#F3E5AB] transition-colors"
                  >
                    Rút Lại Lần Nữa
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <div className="mt-16 pb-4 text-center w-full text-[#D4AF37]/50 text-xs font-serif tracking-widest uppercase">
        Created by Gavin1909
      </div>
    </main>
  );
}
