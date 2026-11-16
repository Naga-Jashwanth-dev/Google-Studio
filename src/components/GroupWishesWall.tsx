import { Heart, Loader2, MessageSquarePlus } from 'lucide-react';
import { useState } from 'react';
import type { GroupNote } from '../types/birthday';

interface GroupWishesWallProps {
  recipientName: string;
  notes: GroupNote[];
  onAddNote: (payload: {
    authorName: string;
    relationship: string;
    message: string;
    memory?: string;
  }) => Promise<void>;
  onCheerNote: (noteId: string) => Promise<void>;
}

function formatShortDate(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function GroupWishesWall({
  recipientName,
  notes,
  onAddNote,
  onCheerNote,
}: GroupWishesWallProps) {
  const [authorName, setAuthorName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [message, setMessage] = useState('');
  const [memory, setMemory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onAddNote({
        authorName: authorName.trim(),
        relationship: relationship.trim() || 'Friend',
        message: message.trim(),
        memory: memory.trim() || undefined,
      });
      setAuthorName('');
      setMessage('');
      setMemory('');
      setSubmittedNotice(true);
      setTimeout(() => setSubmittedNotice(false), 3000);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Unable to post your note right now.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="group-wall"
      className="no-print pt-8 border-t border-stone-200/80 space-y-8"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-stone-500">
            Shared Birthday Board ·{' '}
            <span className="tabular-nums">
              {notes.length} {notes.length === 1 ? 'Note' : 'Notes'} Collected
            </span>
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
            Group Wishes for {recipientName}
          </h2>
        </div>
        <p className="text-sm text-stone-600 max-w-md">
          Friends and family can sign this shared board with their own birthday wishes and favorite memories.
        </p>
      </div>

      {/* Main Layout: Sign Board Form + Friend Notes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sign the Board Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-6 space-y-4"
        >
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-stone-900">
              Sign the Birthday Board
            </h3>
            <p className="text-xs text-stone-500">
              Add your personal note to {recipientName}’s wall.
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="guest-name"
              className="block text-xs font-semibold text-stone-700"
            >
              Your name
            </label>
            <input
              id="guest-name"
              type="text"
              required
              maxLength={60}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g., Jordan Lee"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/70 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="guest-relationship"
              className="block text-xs font-semibold text-stone-700"
            >
              How you know {recipientName}
            </label>
            <input
              id="guest-relationship"
              type="text"
              maxLength={40}
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g., College Friend, Cousin, Coworker"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/70 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="guest-note"
              className="block text-xs font-semibold text-stone-700"
            >
              Your birthday note
            </label>
            <textarea
              id="guest-note"
              required
              rows={3}
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Write something bright for ${recipientName}...`}
              className="w-full px-3.5 py-2 text-sm bg-stone-50/70 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="guest-memory"
              className="block text-xs font-semibold text-stone-700"
            >
              Favorite memory (optional)
            </label>
            <input
              id="guest-memory"
              type="text"
              maxLength={160}
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              placeholder="e.g., Road trip singalong to 90s hits"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/70 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            />
          </div>

          {submitError && (
            <p className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {submitError}
            </p>
          )}

          {submittedNotice && (
            <p className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              Your birthday wish is pinned to {recipientName}’s board.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !authorName.trim() || !message.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Posting wish...
              </>
            ) : (
              <>
                <MessageSquarePlus className="w-4 h-4" />
                Add Note to Wall
              </>
            )}
          </button>
        </form>

        {/* Notes Wall */}
        <div className="lg:col-span-8">
          {notes.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center space-y-2">
              <p className="text-base font-semibold text-stone-900">
                No friend notes yet
              </p>
              <p className="text-sm text-stone-600 max-w-sm mx-auto">
                Be the first to sign {recipientName}’s birthday board, or share the board link so friends can add their notes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-stone-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                      <span className="font-semibold text-stone-900 truncate">
                        {note.authorName}
                      </span>
                      <span className="shrink-0 tabular-nums">
                        {formatShortDate(note.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-stone-700 leading-relaxed">
                      {note.message}
                    </p>

                    {note.memory && (
                      <p className="text-xs text-stone-500 italic">
                        Favorite memory: “{note.memory}”
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-stone-500 truncate">
                      {note.relationship}
                    </span>

                    <button
                      type="button"
                      onClick={() => onCheerNote(note.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-stone-200 text-stone-700 hover:border-rose-300 hover:text-rose-700 hover:bg-rose-50/60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span className="tabular-nums">{note.cheers}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
