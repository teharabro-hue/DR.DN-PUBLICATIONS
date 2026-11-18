import { useState } from 'react';
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';
import type { Book } from '../data/booksData';

export type PaperTheme = 'warm' | 'ivory' | 'sepia';

export interface ReaderNote {
  id: string;
  bookId: string;
  chapterNumber: string;
  text: string;
  createdAt: string;
}

interface BookReaderProps {
  book: Book;
  chapterIndex: number;
  onSelectChapter: (index: number) => void;
  isBookmarked: boolean;
  onToggleBookmark: (bookId: string) => void;
  completedChapters: Record<string, boolean>;
  onToggleChapterComplete: (bookId: string, chapterNumber: string) => void;
  notes: ReaderNote[];
  onAddNote: (bookId: string, chapterNumber: string, text: string) => void;
  onDeleteNote: (noteId: string) => void;
}

const PAPER_STYLES: Record<
  PaperTheme,
  { label: string; bg: string; border: string; text: string; muted: string }
> = {
  warm: {
    label: 'Warm Paper',
    bg: 'bg-[#FBF9F5]',
    border: 'border-[#E5DFD3]',
    text: 'text-[#1C1917]',
    muted: 'text-[#57534E]',
  },
  ivory: {
    label: 'Crisp Ivory',
    bg: 'bg-white',
    border: 'border-[#E5E7EB]',
    text: 'text-[#111827]',
    muted: 'text-[#4B5563]',
  },
  sepia: {
    label: 'Evening Sepia',
    bg: 'bg-[#F4ECD8]',
    border: 'border-[#DFD2B5]',
    text: 'text-[#2C2216]',
    muted: 'text-[#6B5B45]',
  },
};

export function BookReader({
  book,
  chapterIndex,
  onSelectChapter,
  isBookmarked,
  onToggleBookmark,
  completedChapters,
  onToggleChapterComplete,
  notes,
  onAddNote,
  onDeleteNote,
}: BookReaderProps) {
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [paperTheme, setPaperTheme] = useState<PaperTheme>('warm');
  const [draftNote, setDraftNote] = useState('');

  const safeIndex = Math.min(Math.max(chapterIndex, 0), book.chapters.length - 1);
  const chapter = book.chapters[safeIndex];
  const completionKey = `${book.id}:${chapter.number}`;
  const isChapterDone = Boolean(completedChapters[completionKey]);

  const completedCount = book.chapters.filter(
    (ch) => completedChapters[`${book.id}:${ch.number}`]
  ).length;
  const progressPercent = Math.round((completedCount / book.chapters.length) * 100);

  const chapterNotes = notes.filter(
    (n) => n.bookId === book.id && n.chapterNumber === chapter.number
  );

  const theme = PAPER_STYLES[paperTheme];

  const handleNoteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draftNote.trim()) return;
    onAddNote(book.id, chapter.number, draftNote.trim());
    setDraftNote('');
  };

  return (
    <div className="space-y-6">
      {/* Reader Control Bar */}
      <div className="bg-white border border-[#E5DFD3] rounded-lg p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="text-xs text-[#57534E] truncate">
              Reading · {book.author}
            </p>
            <h3 className="font-editorial text-lg font-semibold text-[#1C1917] truncate">
              {book.title}
            </h3>
          </div>

          <span aria-hidden="true" className="hidden sm:inline text-[#D6CEBE]">
            |
          </span>

          <label htmlFor="chapter-select" className="sr-only">
            Select chapter
          </label>
          <select
            id="chapter-select"
            value={safeIndex}
            onChange={(e) => onSelectChapter(Number(e.target.value))}
            className="min-h-[38px] px-3 py-1.5 text-xs sm:text-sm font-medium text-[#1C1917] bg-[#FBF9F5] border border-[#E5DFD3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#881337]"
          >
            {book.chapters.map((ch, idx) => (
              <option key={ch.number} value={idx}>
                Chapter {ch.number} — {ch.title}
              </option>
            ))}
          </select>
        </div>

        {/* Typography & Theme Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Paper Theme */}
          <div
            className="inline-flex items-center p-1 bg-[#F3EFE7] border border-[#E5DFD3] rounded-md"
            role="group"
            aria-label="Reading paper tone"
          >
            {(Object.keys(PAPER_STYLES) as PaperTheme[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPaperTheme(key)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] ${
                  paperTheme === key
                    ? 'bg-white text-[#1C1917] shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {PAPER_STYLES[key].label.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* Serif / Sans */}
          <div
            className="inline-flex items-center p-1 bg-[#F3EFE7] border border-[#E5DFD3] rounded-md"
            role="group"
            aria-label="Reader typeface"
          >
            <button
              type="button"
              onClick={() => setFontFamily('serif')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                fontFamily === 'serif'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              Serif
            </button>
            <button
              type="button"
              onClick={() => setFontFamily('sans')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                fontFamily === 'sans'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              Sans
            </button>
          </div>

          {/* Font Size */}
          <div className="inline-flex items-center border border-[#E5DFD3] rounded-md bg-[#FBF9F5]">
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.max(15, s - 1))}
              aria-label="Decrease text size"
              className="min-w-[34px] min-h-[34px] inline-flex items-center justify-center text-[#57534E] hover:text-[#1C1917] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337]"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-xs tabular-nums text-[#1C1917]">
              {fontSize}px
            </span>
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.min(22, s + 1))}
              aria-label="Increase text size"
              className="min-w-[34px] min-h-[34px] inline-flex items-center justify-center text-[#57534E] hover:text-[#1C1917] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337]"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Save to Reading List */}
          <button
            type="button"
            onClick={() => onToggleBookmark(book.id)}
            aria-pressed={isBookmarked}
            className={`min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] ${
              isBookmarked
                ? 'bg-[#881337] text-white border-[#881337]'
                : 'bg-white text-[#1C1917] border-[#E5DFD3] hover:bg-[#F3EFE7]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isBookmarked ? 'Saved' : 'Save Book'}</span>
          </button>
        </div>
      </div>

      {/* Asymmetric Reading Canvas (70% Chapter Text / 30% Margin & Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <article
          className={`lg:col-span-8 border rounded-lg overflow-hidden transition-colors ${theme.bg} ${theme.border}`}
        >
          {/* Thin Reading Progress Bar */}
          <div className="h-1 w-full bg-black/5">
            <div
              className="h-full bg-[#881337] transition-[width] duration-200"
              style={{
                width: `${Math.max(
                  Math.round(((safeIndex + 1) / book.chapters.length) * 100),
                  progressPercent
                )}%`,
              }}
            />
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            {/* Chapter Header */}
            <header className="pb-6 mb-8 border-b border-black/10 space-y-2">
              <div className={`flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums ${theme.muted}`}>
                <span>Chapter {chapter.number} of {String(book.chapters.length).padStart(2, '0')}</span>
                <span aria-hidden="true">·</span>
                <span>{chapter.readTime}</span>
                <span aria-hidden="true">·</span>
                <span>{book.genre}</span>
              </div>
              <h3 className={`font-editorial text-2xl sm:text-3xl font-semibold leading-snug ${theme.text}`}>
                {chapter.title}
              </h3>
            </header>

            {/* Chapter Prose (Optimal 65-75ch Measure) */}
            <div
              className={`max-w-[68ch] space-y-5 leading-[1.82] ${
                fontFamily === 'serif' ? 'font-editorial' : 'font-sans'
              } ${theme.text}`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {chapter.paragraphs.map((para, pIdx) => (
                <p
                  key={pIdx}
                  className={
                    pIdx === 0
                      ? 'first-letter:text-5xl first-letter:font-editorial first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none first-letter:text-[#881337]'
                      : ''
                  }
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Chapter Footer Navigation & Completion */}
            <footer className="mt-10 pt-6 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onToggleChapterComplete(book.id, chapter.number)}
                aria-pressed={isChapterDone}
                className={`inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-xs sm:text-sm font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] ${
                  isChapterDone
                    ? 'bg-[#14532D] text-white border-[#14532D]'
                    : 'bg-white/80 text-[#1C1917] border-[#D6CEBE] hover:bg-white'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isChapterDone ? 'Chapter Finished' : 'Mark Chapter as Read'}</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={safeIndex === 0}
                  onClick={() => onSelectChapter(safeIndex - 1)}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 text-xs sm:text-sm font-medium text-[#1C1917] bg-white/80 border border-[#D6CEBE] rounded-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  disabled={safeIndex === book.chapters.length - 1}
                  onClick={() => onSelectChapter(safeIndex + 1)}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#881337] rounded-md hover:bg-[#9F1239] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Next Chapter</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </footer>
          </div>
        </article>

        {/* Right Margin Column: Chapter Index & Reader Notes */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Table of Contents */}
          <div className="bg-white border border-[#E5DFD3] rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E5DFD3]">
              <h4 className="text-sm font-semibold text-[#1C1917]">Table of Contents</h4>
              <span className="font-mono text-xs tabular-nums text-[#57534E]">
                {completedCount}/{book.chapters.length} read
              </span>
            </div>
            <ul className="space-y-1">
              {book.chapters.map((ch, idx) => {
                const isCurrent = idx === safeIndex;
                const done = Boolean(completedChapters[`${book.id}:${ch.number}`]);
                return (
                  <li key={ch.number}>
                    <button
                      type="button"
                      onClick={() => onSelectChapter(idx)}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs sm:text-sm flex items-center justify-between gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] ${
                        isCurrent
                          ? 'bg-[#F3EFE7] text-[#1C1917] font-semibold'
                          : 'text-[#57534E] hover:bg-[#FBF9F5] hover:text-[#1C1917]'
                      }`}
                    >
                      <span className="truncate">
                        <span className="font-mono text-xs tabular-nums mr-2 text-[#881337]">
                          {ch.number}
                        </span>
                        {ch.title}
                      </span>
                      <span className="font-mono text-[11px] tabular-nums shrink-0 text-[#57534E]">
                        {done ? 'Done' : ch.readTime}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Personal Margin Notes */}
          <div className="bg-white border border-[#E5DFD3] rounded-lg p-5 space-y-4">
            <div className="pb-3 border-b border-[#E5DFD3]">
              <h4 className="text-sm font-semibold text-[#1C1917]">Margin Reflections</h4>
              <p className="text-xs text-[#57534E] mt-0.5">
                Save private reading notes for Chapter {chapter.number}.
              </p>
            </div>

            <form onSubmit={handleNoteSubmit} className="space-y-2.5">
              <label htmlFor="reader-note-input" className="sr-only">
                Add a reading note
              </label>
              <textarea
                id="reader-note-input"
                rows={3}
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                placeholder="Write a favourite line or thought from this chapter..."
                className="w-full px-3 py-2 text-sm text-[#1C1917] bg-[#FBF9F5] border border-[#E5DFD3] rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#881337]"
              />
              <button
                type="submit"
                disabled={!draftNote.trim()}
                className="w-full min-h-[38px] px-3 py-1.5 text-xs font-medium text-white bg-[#1C1917] rounded-md hover:bg-[#292524] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Save Margin Note
              </button>
            </form>

            {chapterNotes.length > 0 ? (
              <ul className="space-y-2.5 pt-2">
                {chapterNotes.map((note) => (
                  <li
                    key={note.id}
                    className="p-3 bg-[#FBF9F5] border border-[#E5DFD3] rounded-md space-y-1.5"
                  >
                    <p className="text-xs sm:text-sm text-[#1C1917] leading-relaxed">
                      {note.text}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-[#57534E]">
                      <span className="font-mono tabular-nums">{note.createdAt}</span>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(note.id)}
                        aria-label="Delete note"
                        className="inline-flex items-center gap-1 text-[#57534E] hover:text-[#881337] transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#57534E]">
                No notes recorded for this chapter yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
