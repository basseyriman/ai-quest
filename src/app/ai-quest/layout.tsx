import type { Metadata } from "next";
import { AI_QUEST_LANDING_URL, COMPANY_NAME } from "@/lib/brand";
import "./landing.css";

export const metadata: Metadata = {
  title: `AI Quest | Build. Train. Deploy. — ${COMPANY_NAME}`,
  description:
    "AI Quest Engineer Edition — the premium AI engineering card game. 240 cards, real ML pipeline stages, play online or at the table.",
  openGraph: {
    title: "AI Quest — Build. Train. Deploy.",
    description:
      `The premium AI engineering card game from ${COMPANY_NAME}. Race through the ML lifecycle and deploy first.`,
    url: AI_QUEST_LANDING_URL,
    siteName: COMPANY_NAME,
    type: "website",
  },
  alternates: {
    canonical: AI_QUEST_LANDING_URL,
  },
};

export default function AiQuestLandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing-site">
      <div className="landing-site__mesh" aria-hidden />
      <div className="landing-site__vignette" aria-hidden />
      {children}
    </div>
  );
}
