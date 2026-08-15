import { LandingGameBox3DExport } from "@/components/landing/LandingGameBox3D";
import "../ai-quest/landing.css";

export default function BoxRenderPage() {
  return (
    <div style={{ minHeight: "100vh", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LandingGameBox3DExport />
    </div>
  );
}
