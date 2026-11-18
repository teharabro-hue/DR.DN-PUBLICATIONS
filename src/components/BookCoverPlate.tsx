import type { Book } from '../data/booksData';
import { ResilientImage } from './ResilientImage';

interface BookCoverPlateProps {
  book: Book;
  className?: string;
}

export function BookCoverPlate({ book, className = '' }: BookCoverPlateProps) {
  if (book.coverImage) {
    return (
      <div
        className={`relative overflow-hidden bg-[#F3EFE7] border border-[#E5DFD3] ${className}`}
      >
        <ResilientImage
          src={book.coverImage}
          alt={`${book.title} by ${book.author} book cover`}
          fallbackTitle={book.title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col justify-between p-6 border border-[#E5DFD3] select-none ${className}`}
      style={{ backgroundColor: book.clothTone }}
    >
      {/* Subtle spine seam */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-3 w-px bg-white/20"
      />
      <div className="pl-3 space-y-2">
        <p
          className="text-[11px] font-mono tracking-wider uppercase opacity-80"
          style={{ color: book.clothAccent }}
        >
          {book.genre}
        </p>
        <h4 className="font-editorial text-xl sm:text-2xl font-semibold leading-snug text-white">
          {book.title}
        </h4>
      </div>

      <div className="pl-3 pt-6 border-t border-white/20 space-y-1">
        <p className="text-xs text-white/80">{book.edition}</p>
        <p className="text-xs font-medium tracking-wide text-white uppercase">
          {book.author}
        </p>
      </div>
    </div>
  );
}
