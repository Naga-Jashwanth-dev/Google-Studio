import { Check, Copy, Download, ExternalLink, Printer, QrCode, X } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { CARD_THEMES } from '../constants/themes';
import type { BirthdayBoard } from '../types/birthday';
import { downloadCardAsPng } from '../utils/exportCard';

interface ShareQrModalProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
  board: BirthdayBoard;
}

export function ShareQrModal({
  open,
  onClose,
  shareUrl,
  board,
}: ShareQrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [downloadingCard, setDownloadingCard] = useState(false);

  useEffect(() => {
    if (!open || !shareUrl) return;
    let active = true;
    QRCode.toDataURL(shareUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#881337',
        light: '#FFFDF9',
      },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [open, shareUrl]);

  if (!open) return null;

  const theme = CARD_THEMES[board.theme] ?? CARD_THEMES.blush;
  const whatsappMessage = board.passcodeEnabled
    ? `Someone made you a birthday card! Open your surprise: ${shareUrl} (Passcode: ${board.passcode})`
    : `Someone made you a birthday card! Open your surprise: ${shareUrl}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `birthday-qr-${board.recipientName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'card'}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleDownloadCard = async () => {
    setDownloadingCard(true);
    try {
      await downloadCardAsPng(board);
    } finally {
      setDownloadingCard(false);
    }
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-qr-title"
    >
      <div className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2
              id="share-qr-title"
              className="font-display text-2xl font-semibold text-stone-900"
            >
              Share {board.recipientName}’s Surprise
            </h2>
            <p className="text-xs text-stone-500">
              Send the link via WhatsApp/text or print the scannable QR code on a gift tag.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="min-h-[40px] min-w-[40px] rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Link Preview */}
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 flex items-center gap-3">
          <img
            src={theme.imagePath}
            alt="Card share thumbnail"
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200"
          />
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-xs font-semibold text-stone-900 truncate">
              Someone made you a birthday card
            </p>
            <p className="text-[11px] text-stone-600 truncate">
              Happy Birthday, {board.recipientName} — tap to unwrap
            </p>
            <p className="text-[11px] text-rose-600 truncate">{shareUrl}</p>
          </div>
        </div>

        {/* QR Code Box */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 flex flex-col items-center gap-3">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR code for ${board.recipientName}'s birthday website`}
              className="w-40 h-40 rounded-xl border border-rose-200 bg-white p-2"
            />
          ) : (
            <div className="w-40 h-40 rounded-xl border border-rose-200 bg-white flex items-center justify-center text-rose-400">
              <QrCode className="w-10 h-10" />
            </div>
          )}

          {board.passcodeEnabled && (
            <p className="text-xs font-medium text-rose-800">
              Secret Passcode: <span className="font-bold tabular-nums">{board.passcode}</span>
            </p>
          )}
        </div>

        {/* Shareable Link */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-stone-700">
            Shareable Birthday Website Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-700 truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer whitespace-nowrap shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Send via WhatsApp
        </a>

        {/* Export Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleDownloadQr}
            disabled={!qrDataUrl}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl border border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Save QR
          </button>

          <button
            type="button"
            disabled={downloadingCard}
            onClick={handleDownloadCard}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl border border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            {downloadingCard ? 'Saving...' : 'Card PNG'}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              setTimeout(() => window.print(), 150);
            }}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-800 cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Card
          </button>
        </div>
      </div>
    </div>
  );
}
