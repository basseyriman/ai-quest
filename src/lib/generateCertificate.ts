export async function downloadVictoryCertificate(
  winnerName: string,
  finalIp: number
): Promise<void> {
  const W = 1400;
  const H = 990;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#020617");
  bg.addColorStop(0.45, "#0f172a");
  bg.addColorStop(1, "#020617");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(34, 211, 238, 0.85)";
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, W - 96, H - 96);

  ctx.strokeStyle = "rgba(234, 179, 8, 0.55)";
  ctx.lineWidth = 1;
  ctx.strokeRect(72, 72, W - 144, H - 144);

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  try {
    const logo = await loadImage("/ai_quest_logo_clean.png");
    const logoW = 320;
    const logoH = (logo.height / logo.width) * logoW;
    ctx.drawImage(logo, W / 2 - logoW / 2, 95, logoW, logoH);
  } catch {
    ctx.fillStyle = "#22d3ee";
    ctx.font = "bold 56px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("AI QUEST", W / 2, 200);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "600 22px system-ui, sans-serif";
  ctx.fillText("BUILD  ·  TRAIN  ·  DEPLOY", W / 2, 280);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px system-ui, sans-serif";
  ctx.fillText("CERTIFICATE OF VICTORY", W / 2, 360);

  const displayName = winnerName.trim().toUpperCase() || "OPERATIVE";
  const nameGrad = ctx.createLinearGradient(W / 2 - 400, 0, W / 2 + 400, 0);
  nameGrad.addColorStop(0, "#22d3ee");
  nameGrad.addColorStop(0.5, "#ffffff");
  nameGrad.addColorStop(1, "#22d3ee");
  ctx.fillStyle = nameGrad;
  ctx.font = "900 64px system-ui, sans-serif";
  ctx.fillText(displayName, W / 2, 460);

  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = "24px system-ui, sans-serif";
  const body =
    `is hereby recognized as the victorious operative for achieving`;
  ctx.fillText(body, W / 2, 540);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 36px system-ui, sans-serif";
  ctx.fillText(`${finalIp} INTELLIGENCE POINTS`, W / 2, 595);

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillText(
    "and completing the AI QUEST pipeline through Deployment.",
    W / 2,
    645
  );

  ctx.fillStyle = "rgba(34, 211, 238, 0.7)";
  ctx.font = "16px monospace";
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  ctx.fillText(`ISSUED ${date.toUpperCase()}`, W / 2, H - 120);

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "14px monospace";
  ctx.fillText("AI QUEST — OFFICIAL MISSION RECORD", W / 2, H - 88);

  const link = document.createElement("a");
  link.download = `AI-QUEST-Victory-${displayName.replace(/\s+/g, "-")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
