import { Check, ChevronDown, ChevronUp, Loader2, Lock, Save, Sparkles } from 'lucide-react';
import { useState } from 'react';
import {
  CARD_THEMES,
  RELATIONSHIP_OPTIONS,
  VIBE_OPTIONS,
} from '../constants/themes';
import type {
  CardThemeId,
  RelationshipType,
  WishFormInput,
  WishVibe,
} from '../types/birthday';

interface WishCreatorFormProps {
  form: WishFormInput;
  headline: string;
  message: string;
  onChange: (next: WishFormInput) => void;
  onLetterChange: (headline: string, message: string) => void;
  onGenerate: () => void;
  onSaveManual: () => Promise<void>;
  isGenerating: boolean;
  isSaving: boolean;
  savedNotice: boolean;
  error: string | null;
}

const SAMPLE_PROMPTS = [
  'Midnight taco runs after late studio nights',
  'Laughing through a sudden summer rainstorm',
  'Always ordering two desserts for the table',
];

export function WishCreatorForm({
  form,
  headline,
  message,
  onChange,
  onLetterChange,
  onGenerate,
  onSaveManual,
  isGenerating,
  isSaving,
  savedNotice,
  error,
}: WishCreatorFormProps) {
  const [showSurpriseOptions, setShowSurpriseOptions] = useState(true);
  const [showManualLetter, setShowManualLetter] = useState(false);

  const updateField = <K extends keyof WishFormInput>(
    key: K,
    value: WishFormInput[K]
  ) => {
    onChange({ ...form, [key]: value });
  };

  const updateBalloonWord = (idx: 0 | 1 | 2 | 3, val: string) => {
    const next: [string, string, string, string] = [...form.balloonWords] as [
      string,
      string,
      string,
      string,
    ];
    next[idx] = val.slice(0, 18);
    updateField('balloonWords', next);
  };

  const updateBouquetNote = (idx: number, val: string) => {
    const next = [...form.bouquetNotes];
    while (next.length < 6) next.push('');
    next[idx] = val.slice(0, 48);
    updateField('bouquetNotes', next.slice(0, 6));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 space-y-6"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
          Personalize Your Birthday Website
        </h2>
        <p className="text-sm text-stone-600">
          Customize the secret passcode, balloon words, bouquet notes, and AI-crafted heart letter.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <label
            htmlFor="recipient-name"
            className="block text-xs font-semibold text-stone-700"
          >
            Recipient’s name
          </label>
          <input
            id="recipient-name"
            type="text"
            required
            maxLength={80}
            value={form.recipientName}
            onChange={(e) => updateField('recipientName', e.target.value)}
            placeholder="e.g., Maya or Akka"
            className="w-full px-3.5 py-2.5 text-sm bg-stone-50/60 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="recipient-age"
            className="block text-xs font-semibold text-stone-700"
          >
            Age (optional)
          </label>
          <input
            id="recipient-age"
            type="text"
            inputMode="numeric"
            maxLength={12}
            value={form.age}
            onChange={(e) => updateField('age', e.target.value)}
            placeholder="e.g., 28"
            className="w-full px-3.5 py-2.5 text-sm bg-stone-50/60 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 tabular-nums focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="relationship-select"
            className="block text-xs font-semibold text-stone-700"
          >
            Relationship
          </label>
          <select
            id="relationship-select"
            value={form.relationship}
            onChange={(e) =>
              updateField('relationship', e.target.value as RelationshipType)
            }
            className="w-full px-3.5 py-2.5 text-sm bg-stone-50/60 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-colors"
          >
            {RELATIONSHIP_OPTIONS.map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="sender-name"
            className="block text-xs font-semibold text-stone-700"
          >
            From (signature)
          </label>
          <input
            id="sender-name"
            type="text"
            maxLength={60}
            value={form.senderName}
            onChange={(e) => updateField('senderName', e.target.value)}
            placeholder="e.g., Aadhi"
            className="w-full px-3.5 py-2.5 text-sm bg-stone-50/60 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      {/* Vibe Selector */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-stone-700">
          Wish vibe
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {VIBE_OPTIONS.map((option) => {
            const active = form.vibe === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => updateField('vibe', option.id as WishVibe)}
                className={`min-h-[44px] px-3 py-2 text-left rounded-lg border transition-colors cursor-pointer ${
                  active
                    ? 'bg-rose-50 border-rose-500 text-rose-900'
                    : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-100/70'
                }`}
              >
                <div className="text-xs font-semibold whitespace-nowrap">
                  {option.label}
                </div>
                <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                  {option.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Personal Memories / Inside Jokes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="memories-input"
            className="block text-xs font-semibold text-stone-700"
          >
            Personal memories or inside jokes
          </label>
          <span className="text-xs text-stone-400 tabular-nums">
            {form.memories.length}/600
          </span>
        </div>
        <textarea
          id="memories-input"
          rows={3}
          maxLength={600}
          value={form.memories}
          onChange={(e) => updateField('memories', e.target.value)}
          placeholder="e.g., Late night calls, inside jokes, favorite trips together..."
          className="w-full px-3.5 py-2.5 text-sm bg-stone-50/60 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-colors resize-y"
        />
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="text-xs text-stone-500">Quick add:</span>
          {SAMPLE_PROMPTS.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() =>
                updateField(
                  'memories',
                  form.memories.trim()
                    ? `${form.memories.trim()}; ${sample.toLowerCase()}`
                    : sample
                )
              }
              className="text-xs text-stone-600 hover:text-rose-700 underline underline-offset-2 decoration-stone-300 hover:decoration-rose-400 cursor-pointer text-left"
            >
              + {sample.slice(0, 28)}...
            </button>
          ))}
        </div>
      </div>

      {/* Atmosphere / Theme Picker */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-stone-700">
          Experience theme
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.keys(CARD_THEMES) as CardThemeId[]).map((themeId) => {
            const theme = CARD_THEMES[themeId];
            const selected = form.theme === themeId;
            return (
              <button
                key={themeId}
                type="button"
                onClick={() => updateField('theme', themeId)}
                className={`rounded-xl overflow-hidden border text-left transition-all cursor-pointer ${
                  selected
                    ? 'border-rose-600 ring-2 ring-rose-500/25'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div
                  className="h-8 w-full"
                  style={{ background: theme.gradientBg }}
                />
                <div className="px-2 py-1.5 bg-white">
                  <div className="text-[11px] font-semibold text-stone-900 truncate">
                    {theme.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Surprise Settings (Passcode, Balloons & Bouquet) */}
      <div className="border-t border-stone-200 pt-4 space-y-3">
        <button
          type="button"
          onClick={() => setShowSurpriseOptions((v) => !v)}
          className="w-full flex items-center justify-between text-xs font-semibold text-stone-800 cursor-pointer"
        >
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-600" />
            Passcode Lock, Balloons &amp; Bouquet Notes
          </span>
          {showSurpriseOptions ? (
            <ChevronUp className="w-4 h-4 text-stone-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-500" />
          )}
        </button>

        {showSurpriseOptions && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="passcode-toggle"
                className="text-xs font-medium text-stone-700"
              >
                Require 4-digit secret passcode to unlock
              </label>
              <input
                id="passcode-toggle"
                type="checkbox"
                checked={form.passcodeEnabled}
                onChange={(e) => updateField('passcodeEnabled', e.target.checked)}
                className="w-4 h-4 accent-rose-600 cursor-pointer"
              />
            </div>

            {form.passcodeEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="passcode-digits"
                    className="block text-[11px] font-semibold text-stone-600"
                  >
                    4-digit code
                  </label>
                  <input
                    id="passcode-digits"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={form.passcode}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '').slice(0, 4);
                      updateField('passcode', clean);
                    }}
                    placeholder="3105"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg tabular-nums tracking-widest font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label
                    htmlFor="passcode-hint"
                    className="block text-[11px] font-semibold text-stone-600"
                  >
                    Passcode hint shown on lock screen
                  </label>
                  <input
                    id="passcode-hint"
                    type="text"
                    maxLength={80}
                    value={form.passcodeHint}
                    onChange={(e) => updateField('passcodeHint', e.target.value)}
                    placeholder="e.g., Your birthday MMDD (3105)"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="block text-[11px] font-semibold text-stone-600">
                4-word balloon pop reveal
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={18}
                    value={form.balloonWords[i as 0 | 1 | 2 | 3]}
                    onChange={(e) =>
                      updateBalloonWord(i as 0 | 1 | 2 | 3, e.target.value)
                    }
                    aria-label={`Balloon word ${i + 1}`}
                    className="w-full px-2.5 py-2 text-xs text-center font-medium bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="block text-[11px] font-semibold text-stone-600">
                6 rose bouquet floating notes
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={48}
                    value={form.bouquetNotes[i] ?? ''}
                    onChange={(e) => updateBouquetNote(i, e.target.value)}
                    placeholder={`Bouquet note ${i + 1}`}
                    aria-label={`Bouquet note ${i + 1}`}
                    className="w-full px-2.5 py-2 text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Optional Manual Letter Edit */}
      <div className="border-t border-stone-200 pt-4 space-y-3">
        <button
          type="button"
          onClick={() => setShowManualLetter((v) => !v)}
          className="w-full flex items-center justify-between text-xs font-semibold text-stone-800 cursor-pointer"
        >
          <span>Edit Letter Text Directly</span>
          {showManualLetter ? (
            <ChevronUp className="w-4 h-4 text-stone-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-500" />
          )}
        </button>

        {showManualLetter && (
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-stone-600">
                Card headline
              </label>
              <input
                type="text"
                maxLength={140}
                value={headline}
                onChange={(e) => onLetterChange(e.target.value, message)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-stone-600">
                Heart letter message
              </label>
              <textarea
                rows={4}
                maxLength={2000}
                value={message}
                onChange={(e) => onLetterChange(headline, e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-y"
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          type="submit"
          disabled={isGenerating || !form.recipientName.trim()}
          className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Writing Letter...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate AI Wish
            </>
          )}
        </button>

        <button
          type="button"
          disabled={isSaving || !form.recipientName.trim()}
          onClick={onSaveManual}
          className="min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {savedNotice ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              Saved
            </>
          ) : isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
