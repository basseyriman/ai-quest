"use client";

import { motion } from "framer-motion";
import { useEffect, useState, Fragment } from "react";
import { ChevronRight } from "lucide-react";

export interface FlowStage {
  id: string | number;
  label: string;
  suffix?: string;
}

interface IntroAnimatedFlowProps {
  title: string;
  stages: FlowStage[];
  accentColor: string;
  borderColor: string;
  onEnter?: () => void;
}

const titleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18 },
  },
};

const titleWordVariants = {
  hidden: {
    opacity: 0,
    x: 120,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 110,
      damping: 16,
    },
  },
};

const stepsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.55,
      staggerChildren: 0.14,
    },
  },
};

const stepVariants = {
  hidden: {
    opacity: 0,
    x: 900,
    filter: "blur(12px)",
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 95,
      damping: 14,
    },
  },
};

const getFlowTheme = (accentColor: string) => {
  const isEngineer = accentColor === "#f43f5e";
  if (isEngineer) {
    return {
      fill: "rgba(136, 19, 55, 0.4)",
      fillHover: "rgba(136, 19, 55, 0.6)",
      border: "rgba(244, 63, 94, 0.5)",
      borderHover: "rgba(244, 63, 94, 1)",
      glow: "0 0 20px rgba(244, 63, 94, 0.12)",
      glowHover: "0 0 28px rgba(244, 63, 94, 0.3)",
    };
  }
  return {
    fill: "rgba(8, 145, 178, 0.4)",
    fillHover: "rgba(8, 145, 178, 0.6)",
    border: "rgba(6, 182, 212, 0.5)",
    borderHover: "rgba(34, 211, 238, 1)",
    glow: "0 0 20px rgba(34, 211, 238, 0.1)",
    glowHover: "0 0 28px rgba(34, 211, 238, 0.3)",
  };
};

export const IntroAnimatedFlow = ({
  title,
  stages,
  accentColor,
  borderColor,
  onEnter,
}: IntroAnimatedFlowProps) => {
  const titleWords = title.split(" ");
  const [showEnter, setShowEnter] = useState(false);
  const theme = getFlowTheme(accentColor);

  useEffect(() => {
    if (!onEnter) return;
    const titleDuration = titleWords.length * 180 + 200;
    const duration = titleDuration + stages.length * 140 + 400;
    const timer = setTimeout(() => setShowEnter(true), duration);
    return () => clearTimeout(timer);
  }, [onEnter, stages.length, titleWords.length]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <motion.h1
        variants={titleContainerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.35em",
          textAlign: "center",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          lineHeight: 1.2,
          color: "white",
          fontWeight: 900,
          letterSpacing: "0.2em",
          fontSize: "clamp(26px, 3.2vw, 42px)",
          fontFamily: "monospace",
          textShadow: `0 0 20px ${accentColor}80, 0 0 40px ${accentColor}40`,
          marginBottom: "40px",
          width: "100%",
        }}
      >
        {titleWords.map((word, idx) => (
          <motion.span key={`${word}-${idx}`} variants={titleWordVariants}>
            {word}
          </motion.span>
        ))}
      </motion.h1>

      <motion.div
        variants={stepsContainerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr auto 1fr",
          gap: "14px",
          width: "100%",
          maxWidth: "960px",
          fontFamily: "monospace",
        }}
      >
        {stages.map((stage, i) => {
          const showArrow = (i + 1) % 3 !== 0;
          return (
          <Fragment key={stage.id}>
            <motion.div
              variants={stepVariants}
              style={{
                padding: "18px 24px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "24px",
                backgroundColor: "rgba(10, 10, 12, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(15, 15, 18, 0.9)";
                e.currentTarget.style.borderColor = "rgba(244, 63, 94, 0.4)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(244, 63, 94, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(10, 10, 12, 0.75)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: accentColor,
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  width: "20px",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {stage.id}.
              </span>
              <span style={{ color: "rgba(255,255,255,0.9)", textAlign: "left", fontSize: "14px", fontWeight: 600, letterSpacing: "0.05em" }}>
                {stage.label}
                {stage.suffix && (
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "sans-serif",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {stage.suffix}
                  </span>
                )}
              </span>
            </motion.div>
            {showArrow && (
              <motion.div variants={stepVariants} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight color={accentColor} size={28} style={{ opacity: 0.6 }} />
              </motion.div>
            )}
          </Fragment>
        )})}
      </motion.div>

      {onEnter && showEnter && (
        <motion.button
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 16 }}
          onClick={onEnter}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "monospace",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            transition: "all 0.3s ease",
            borderRadius: "12px",
            color: "white",
            cursor: "pointer",
            border: `1px solid ${theme.border}`,
            padding: "20px 48px",
            gap: "12px",
            fontSize: "18px",
            marginTop: "32px",
            backgroundColor: theme.fill,
            boxShadow: theme.glow,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.backgroundColor = theme.fillHover;
            e.currentTarget.style.borderColor = theme.borderHover;
            e.currentTarget.style.boxShadow = theme.glowHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = theme.fill;
            e.currentTarget.style.borderColor = theme.border;
            e.currentTarget.style.boxShadow = theme.glow;
          }}
        >
          ENTER <ChevronRight size={22} />
        </motion.button>
      )}
    </div>
  );
};

export const ENGINEER_FLOW_STAGES: FlowStage[] = [
  { id: 1, label: "System Objective" },
  { id: 2, label: "Data Source" },
  { id: 3, label: "Data Cleaning" },
  { id: 4, label: "FDA (Analysis)" },
  { id: 5, label: "Feature Eng." },
  { id: 6, label: "Model Selection" },
  { id: 7, label: "Validation" },
  { id: 8, label: "Deployment" },
  { id: 9, label: "Monitoring" },
];
