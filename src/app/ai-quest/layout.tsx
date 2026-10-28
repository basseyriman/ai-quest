import type { Metadata } from "next";
import { AI_QUEST_LANDING_URL, COMPANY_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: `AI Quest | Build. Train. Deploy. — ${COMPANY_NAME}`,
  description:
    "AI Quest Engineer Edition — the premium AI engineering card game. 240 cards, 7 real ML pipeline stages, play online right in your browser or at the table.",
  openGraph: {
    title: "AI Quest — Build. Train. Deploy.",
    description:
      `The premium AI engineering card game from ${COMPANY_NAME}. Race through the 7-stage ML lifecycle and deploy first.`,
    url: AI_QUEST_LANDING_URL,
    siteName: COMPANY_NAME,
    type: "website",
  },
  alternates: {
    canonical: AI_QUEST_LANDING_URL,
  },
};

export default function AiQuestLandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
