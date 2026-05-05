"use client";

import { motion } from "framer-motion";
import { CardOrientation } from "../types/tarot";

interface TarotCardProps {
  name: string;
  orientation: CardOrientation;
  isRevealed: boolean;
  onReveal?: () => void;
}

export default function TarotCard({ name, orientation, isRevealed, onReveal }: TarotCardProps) {
  return (
    <div 
      className="relative w-64 h-96 cursor-pointer group mx-auto"
      style={{ perspective: "1000px" }}
      onClick={!isRevealed ? onReveal : undefined}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 15 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Back of the card */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl border-2 border-[#D4AF37] bg-[#1a1a1a] shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-[calc(100%-1rem)] h-[calc(100%-1rem)] border border-[#D4AF37]/50 rounded-lg flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#D4AF37_0%,_transparent_70%)]"></div>
            <div className="text-[#D4AF37] opacity-50 relative z-10 flex flex-col items-center gap-2">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 12l10 10 10-10L12 2z"></path>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
              <span className="text-xs font-serif tracking-[0.2em] uppercase">AI Tarot</span>
            </div>
          </div>
        </div>

        {/* Front of the card */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl border-2 border-[#D4AF37] bg-[#1a1a1a] flex flex-col items-center justify-center p-2"
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)",
            boxShadow: isRevealed ? "0 0 30px rgba(212,175,55,0.6)" : "none" // Glow effect
          }}
        >
          <div 
            className="w-full h-full border border-[#D4AF37]/60 rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden"
            style={{
              transform: orientation === "Reversed" ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.8s ease-in-out"
            }}
          >
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37] via-transparent to-transparent"></div>
             
             {/* Card Illustration Placeholder */}
             <div className="flex-1 w-full flex items-center justify-center text-[#D4AF37]">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  <path d="M2 12h20"></path>
                </svg>
             </div>
             
             <div className="mt-4 text-center pb-2">
               <h3 className="text-[#D4AF37] font-serif font-bold text-lg tracking-widest uppercase">{name}</h3>
               {orientation === "Reversed" && (
                 <span className="text-xs text-[#D4AF37]/70 uppercase tracking-widest mt-1 block">Reversed</span>
               )}
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
