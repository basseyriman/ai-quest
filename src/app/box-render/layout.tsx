import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BoxRenderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "transparent", minHeight: "100vh" }}>{children}</div>
  );
}
