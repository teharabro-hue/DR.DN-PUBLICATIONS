import { useEffect, useState } from 'react';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import {
  formatPrice,
  type Book,
  type BookEdition,
  type CurrencyCode,
} from '../data/booksData';
import { BookCoverPlate } from './BookCoverPlate';

interface BookPurchaseModalProps {
  book: Book | null;
  currency: CurrencyCode;
  onClose: () => void;
  onAddToBag: (book: Book, edition: BookEdition, quantity: number) => void;
  onOpenReader: (bookId: string) => void;
}

export function BookPurchaseModal({
  book,
  currency,
  onClose,
  onAddToBag,
  onOpenReader,
}: BookPurchaseModalProps) {
  const [selectedEditionId, setSelectedEditionId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (!book) return;
    setSelectedEditionId(book.editions[1]?.id ?? book.editions[0].id);
    setQuantity(1);
  }, [book]);

  useEffect(() => {
    if (!book) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [book, onClose]);

  if (!book) return null;

  const activeEdition =
    book.editions.find((e) => e.id === selectedEditionId) ?? book.editions[0];

  const handleAdd = () => {
    onAddToBag(book, activeEdition, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/55 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="purchase-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#FBF9F5] border border-[#E5DFD3] rounded-lg shadow-xl overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5DFD3]">
          <div className="flex items-center gap-2 text-xs text-[#57534E]">
            <span>{book.genre}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">ISBN {book.isbn}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edition selector"
            className="min-w-[38px] min-h-[38px] inline-flex items-center justify-center rounded-md border border-[#E5DFD3] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3EFE7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Cover Gallery */}
          <div className="md:col-span-5 bg-[#F3EFE7] border border-[#E5DFD3] rounded-lg p-5">
            <div className="aspect-[2/3] w-full max-w-[240px] mx-auto rounded overflow-hidden shadow-md">
              <BookCoverPlate book={book} className="w-full h-full" />
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5DFD3] flex items-center justify-between text-xs font-mono tabular-nums text-[#57534E]">
              <span>{book.pages} pages</span>
              <span>{book.year}</span>
            </div>
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#881337]">By {book.author}</p>
              <h3
                id="purchase-modal-title"
                className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917] leading-tight"
              >
                {book.title}
              </h3>
              <p className="text-sm text-[#44403C] leading-relaxed">{book.synopsis}</p>
            </div>

            {/* Edition Selector */}
            <div className="space-y-2.5">
              <p className="text-xs font-medium text-[#57534E]">Select Edition Format</p>
              <div className="space-y-2">
                {book.editions.map((ed) => {
                  const isSelected = ed.id === activeEdition.id;
                  return (
                    <button
                      key={ed.id}
                      type="button"
                      onClick={() => setSelectedEditionId(ed.id)}
                      className={`w-full text-left p-3.5 rounded-md border transition-colors flex items-start justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] ${
                        isSelected
                          ? 'bg-white border-[#881337] shadow-xs'
                          : 'bg-white/60 border-[#E5DFD3] hover:bg-white'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-[#1C1917]">{ed.label}</p>
                        <p className="text-xs text-[#57534E]">{ed.bindingDetail}</p>
                        <p className="text-[11px] font-medium text-[#14532D] pt-0.5">
                          {ed.availability}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold tabular-nums text-[#1C1917] shrink-0">
                        {formatPrice(ed.priceLKR, ed.priceUSD, currency)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Primary CTA */}
            <div className="pt-4 border-t border-[#E5DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#57534E]">Qty</span>
                <div className="inline-flex items-center border border-[#E5DFD3] rounded-md bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-[#57534E] hover:text-[#1C1917]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-mono text-sm tabular-nums text-[#1C1917]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Increase quantity"
                    className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-[#57534E] hover:text-[#1C1917]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReader(book.id);
                  }}
                  className="min-h-[42px] px-4 py-2 text-xs sm:text-sm font-medium text-[#1C1917] bg-white border border-[#E5DFD3] rounded-md hover:bg-[#F3EFE7] transition-colors whitespace-nowrap"
                >
                  Preview Online
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 text-xs sm:text-sm font-medium text-white bg-[#881337] rounded-md hover:bg-[#9F1239] transition-colors whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Add to Bag ·{' '}
                    {formatPrice(
                      activeEdition.priceLKR * quantity,
                      activeEdition.priceUSD * quantity,
                      currency
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
