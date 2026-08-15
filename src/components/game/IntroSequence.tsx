import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { IntroAnimatedFlow, ENGINEER_FLOW_STAGES } from "./IntroAnimatedFlow";

interface IntroSequenceProps {
  onComplete: () => void;
  onAbort?: () => void;
}

const ACTIVE_COLOR = "#f43f5e";

const slides = [
  {
    title: "STANDARD PROCESS FLOW",
    animatedFlow: true,
    topElement: null,
    content: null,
  },
];

export const IntroSequence = ({ onComplete, onAbort }: IntroSequenceProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const currentSlideData = slides[currentSlide];
  const topElement = currentSlideData.topElement;
  const isAnimatedFlow = "animatedFlow" in currentSlideData && currentSlideData.animatedFlow;
  const isLastSlide = currentSlide === slides.length - 1;
  const enterInContent = isAnimatedFlow && isLastSlide;

  return (
    <motion.div
      key="intro-sequence"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)",
        color: "white",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.05,
          backgroundImage: "url(https://www.transparenttextures.com/patterns/cubes.png)",
          mixBlendMode: "overlay",
        }}
      />

      {onAbort && (
        <button
          onClick={onAbort}
          style={{
            position: "absolute",
            top: "32px",
            left: "32px",
            zIndex: 100,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: "14px",
            letterSpacing: "0.2em",
            padding: "12px 24px",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            backgroundColor: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textTransform: "uppercase",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "white";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <span>←</span> ABORT
        </button>
      )}

      {/* Top Indicators */}
      <div style={{ display: "flex", gap: "8px", marginTop: "36px", zIndex: 20 }}>
        <div style={{ width: "16px", height: "4px", backgroundColor: "#27272a", borderRadius: "2px" }} />
        <div style={{ width: "16px", height: "4px", backgroundColor: "#27272a", borderRadius: "2px" }} />
        <div style={{ 
          width: "36px", 
          height: "4px", 
          backgroundColor: ACTIVE_COLOR, 
          borderRadius: "2px",
          boxShadow: `0 0 10px ${ACTIVE_COLOR}, 0 0 20px ${ACTIVE_COLOR}`
        }} />
      </div>

      <div
        style={{
          flex: 1,
          width: "100%",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          maxWidth: "1200px",
          padding: "0 24px",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: "24px",
            }}
          >
            {topElement && (
              <div style={{ marginBottom: "32px", display: "flex", justifyContent: "center" }}>
                {topElement}
              </div>
            )}

            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              {isAnimatedFlow ? (
                <IntroAnimatedFlow
                  title={currentSlideData.title}
                  stages={ENGINEER_FLOW_STAGES}
                  accentColor={ACTIVE_COLOR}
                  borderColor="rgba(244,63,94,0.2)"
                  onEnter={enterInContent ? onComplete : undefined}
                />
              ) : (
                currentSlideData.content
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {(!enterInContent || currentSlide >= 0) && (
        <div
          style={{
            width: "100%",
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
            padding: "16px 48px 36px 48px",
          }}
        >
          <button
            onClick={() => {
              if (currentSlide === 0) {
                if (onAbort) onAbort();
              } else {
                setCurrentSlide((prev) => Math.max(0, prev - 1));
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              transition: "all 0.3s ease",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "16px 32px",
              gap: "12px",
              fontSize: "16px",
              backgroundColor: "transparent",
              color: "rgba(255,255,255,0.5)",
              opacity: 1,
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "white";
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <ChevronLeft size={20} /> PREVIOUS
          </button>

          {!enterInContent &&
            (currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  transition: "all 0.3s ease",
                  borderRadius: "8px",
                  cursor: "pointer",
                  padding: "16px 36px",
                  gap: "12px",
                  fontSize: "16px",
                  backgroundColor: `${ACTIVE_COLOR}15`,
                  color: ACTIVE_COLOR,
                  border: `1px solid ${ACTIVE_COLOR}40`,
                  boxShadow: `0 0 15px ${ACTIVE_COLOR}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${ACTIVE_COLOR}30`;
                  e.currentTarget.style.boxShadow = `0 0 25px ${ACTIVE_COLOR}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${ACTIVE_COLOR}15`;
                  e.currentTarget.style.boxShadow = `0 0 15px ${ACTIVE_COLOR}20`;
                }}
              >
                NEXT PROTOCOL <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={onComplete}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "monospace",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  transition: "all 0.3s ease",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                  border: "none",
                  padding: "18px 42px",
                  gap: "16px",
                  fontSize: "16px",
                  backgroundColor: ACTIVE_COLOR,
                  boxShadow: `0 0 30px ${ACTIVE_COLOR}80`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = `0 0 40px ${ACTIVE_COLOR}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = `0 0 30px ${ACTIVE_COLOR}80`;
                }}
              >
                ACKNOWLEDGE & ENTER <ChevronRight size={22} />
              </button>
            ))}
        </div>
      )}
    </motion.div>
  );
};
