import { CARD_THEMES } from '../constants/themes';
import type { BirthdayBoard } from '../types/birthday';

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }
    let currentLine = words[0];
    for (let i = 1; i < words.length; i += 1) {
      const testLine = `${currentLine} ${words[i]}`;
      if (ctx.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);
  }
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function downloadCardAsPng(board: BirthdayBoard): Promise<void> {
  const theme = CARD_THEMES[board.theme] ?? CARD_THEMES.blush;
  const width = 1400;
  const height = 1750;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to create canvas context.');
  }

  // Paper background
  ctx.fillStyle = theme.surfaceBg;
  ctx.fillRect(0, 0, width, height);

  // Subtle outer frame
  ctx.strokeStyle = theme.isDark ? 'rgba(255,255,255,0.16)' : 'rgba(28,25,23,0.12)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // Artwork area (top 4:3 panel)
  const artX = 76;
  const artY = 76;
  const artW = width - 152;
  const artH = 760;

  const img = await loadImage(theme.imagePath);
  if (img) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(artX, artY, artW, artH, 24);
    ctx.clip();

    const imgRatio = img.width / img.height;
    const boxRatio = artW / artH;
    let drawW = artW;
    let drawH = artH;
    let offsetX = artX;
    let offsetY = artY;

    if (imgRatio > boxRatio) {
      drawW = artH * imgRatio;
      offsetX = artX - (drawW - artW) / 2;
    } else {
      drawH = artW / imgRatio;
      offsetY = artY - (drawH - artH) / 2;
    }
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    ctx.restore();
  } else {
    ctx.fillStyle = theme.isDark ? '#1E293B' : '#F5F0E6';
    ctx.beginPath();
    ctx.roundRect(artX, artY, artW, artH, 24);
    ctx.fill();
  }

  // Kicker metadata
  let cursorY = artY + artH + 84;
  ctx.fillStyle = theme.accentHex;
  ctx.font = '600 26px "Plus Jakarta Sans", system-ui, sans-serif';
  const kickerParts = [
    `For ${board.recipientName}`,
    board.age ? `Turning ${board.age}` : null,
    board.relationship,
  ].filter(Boolean);
  ctx.fillText(kickerParts.join('  ·  '), artX, cursorY);

  // Headline
  cursorY += 68;
  ctx.fillStyle = theme.textColor;
  ctx.font = '600 58px "Fraunces", Georgia, serif';
  const headlineLines = wrapText(ctx, board.headline, artW);
  for (const line of headlineLines.slice(0, 3)) {
    ctx.fillText(line, artX, cursorY);
    cursorY += 70;
  }

  // Hairline divider
  cursorY += 16;
  ctx.strokeStyle = theme.isDark ? 'rgba(255,255,255,0.16)' : 'rgba(28,25,23,0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(artX, cursorY);
  ctx.lineTo(artX + artW, cursorY);
  ctx.stroke();

  // Message body
  cursorY += 56;
  ctx.fillStyle = theme.mutedColor;
  ctx.font = '400 32px "Plus Jakarta Sans", system-ui, sans-serif';
  const bodyLines = wrapText(ctx, board.message, artW);
  for (const line of bodyLines.slice(0, 10)) {
    if (cursorY > height - 220) break;
    ctx.fillText(line, artX, cursorY);
    cursorY += 48;
  }

  // Toast & signature footer
  const footerY = height - 150;
  if (board.toastQuote) {
    ctx.fillStyle = theme.accentHex;
    ctx.font = 'italic 500 30px "Fraunces", Georgia, serif';
    ctx.fillText(`“${board.toastQuote}”`, artX, footerY);
  }

  ctx.fillStyle = theme.textColor;
  ctx.font = '600 28px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(`With love, ${board.senderName || 'Your Friends'}`, artX, height - 92);

  const safeFile =
    board.recipientName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'friend';

  const link = document.createElement('a');
  link.download = `birthday-card-${safeFile}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
