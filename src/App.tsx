import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Menu,
  Package,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import {
  BOOKS_CATALOG,
  formatPrice,
  type Book,
  type BookEdition,
  type BookGenre,
  type CurrencyCode,
} from './data/booksData';
import { BookCoverPlate } from './components/BookCoverPlate';
import { BookPurchaseModal } from './components/BookPurchaseModal';
import { BookReader, type ReaderNote } from './components/BookReader';
import { CartDrawer, type CartItem, type OrderRecord } from './components/CartDrawer';
import { ResilientImage } from './components/ResilientImage';

type GenreFilter = 'All Books' | BookGenre;

const GENRE_FILTERS: GenreFilter[] = [
  'All Books',
  'Romantic Love Story',
  'Literary Essays',
  'Short Stories',
];

const STORAGE_KEYS = {
  bookmarks: 'dnw_reading_bookmarks_v1',
  completed: 'dnw_reading_completed_v1',
  notes: 'dnw_reading_notes_v1',
  cart: 'dnw_bookshop_cart_v1',
  orders: 'dnw_bookshop_orders_v1',
  currency: 'dnw_bookshop_currency_v1',
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeGenre, setActiveGenre] = useState<GenreFilter>('All Books');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBookId, setActiveBookId] = useState<string>(BOOKS_CATALOG[0].id);
  const [chapterIndex, setChapterIndex] = useState<number>(0);

  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.currency);
      return saved === 'USD' ? 'USD' : 'LKR';
    } catch {
      return 'LKR';
    }
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.cart);
      if (!saved) return [];
      const parsed = JSON.parse(saved) as Array<{
        bookId: string;
        editionId: string;
        quantity: number;
      }>;
      const hydrated: CartItem[] = [];
      for (const entry of parsed) {
        const book = BOOKS_CATALOG.find((b) => b.id === entry.bookId);
        const edition = book?.editions.find((e) => e.id === entry.editionId);
        if (book && edition && entry.quantity > 0) {
          hydrated.push({ book, edition, quantity: entry.quantity });
        }
      }
      return hydrated;
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.orders);
      return saved ? (JSON.parse(saved) as OrderRecord[]) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [purchaseBook, setPurchaseBook] = useState<Book | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.bookmarks);
      return saved ? (JSON.parse(saved) as string[]) : ['waruni-sanhitthaka-malawa'];
    } catch {
      return ['waruni-sanhitthaka-malawa'];
    }
  });

  const [completedChapters, setCompletedChapters] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.completed);
      return saved ? (JSON.parse(saved) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  const [notes, setNotes] = useState<ReaderNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.notes);
      return saved ? (JSON.parse(saved) as ReaderNote[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.currency, currency);
    } catch {
      // ignore storage errors
    }
  }, [currency]);

  useEffect(() => {
    try {
      const serialized = cartItems.map((item) => ({
        bookId: item.book.id,
        editionId: item.edition.id,
        quantity: item.quantity,
      }));
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(serialized));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    } catch {
      // ignore storage errors
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
    } catch {
      // ignore storage errors
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(completedChapters));
    } catch {
      // ignore storage errors
    }
  }, [completedChapters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
    } catch {
      // ignore storage errors
    }
  }, [notes]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const featuredBook = BOOKS_CATALOG[0];
  const activeBook =
    BOOKS_CATALOG.find((b) => b.id === activeBookId) ?? BOOKS_CATALOG[0];

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const filteredBooks = BOOKS_CATALOG.filter((book) => {
    const matchesGenre = activeGenre === 'All Books' || book.genre === activeGenre;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      query === '' ||
      book.title.toLowerCase().includes(query) ||
      book.subtitle.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query);
    return matchesGenre && matchesQuery;
  });

  const openInReader = (bookId: string, startChapter = 0) => {
    setActiveBookId(bookId);
    setChapterIndex(startChapter);
    setMobileMenuOpen(false);
    const el = document.getElementById('reader');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToBag = (book: Book, edition: BookEdition, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.edition.id === edition.id);
      if (existing) {
        return prev.map((i) =>
          i.edition.id === edition.id
            ? { ...i, quantity: Math.min(20, i.quantity + quantity) }
            : i
        );
      }
      return [...prev, { book, edition, quantity }];
    });
    showToast(`Added ${book.title} (${edition.format}) to bag`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (editionId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.edition.id === editionId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (editionId: string) => {
    setCartItems((prev) => prev.filter((item) => item.edition.id !== editionId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderConfirmed = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
  };

  const toggleBookmark = (bookId: string) => {
    setBookmarks((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const toggleChapterComplete = (bookId: string, chapterNumber: string) => {
    const key = `${bookId}:${chapterNumber}`;
    setCompletedChapters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const addNote = (bookId: string, chapterNumber: string, text: string) => {
    const now = new Date();
    const stamp = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    setNotes((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        bookId,
        chapterNumber,
        text,
        createdAt: stamp,
      },
      ...prev,
    ]);
  };

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const savedBooks = BOOKS_CATALOG.filter((b) => bookmarks.includes(b.id));
  const featuredPaperback = featuredBook.editions[1] ?? featuredBook.editions[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* Top Bar Contract: Exact 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-[#E5DFD3]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#featured"
            className="font-editorial text-base sm:text-lg font-semibold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] rounded-sm"
          >
            DR. DN WICKRAMASINGHE
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]"
          >
            <a
              href="#featured"
              className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Featured Book
            </a>
            <a
              href="#library"
              className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Bookshop
            </a>
            <a
              href="#reader"
              className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Reader
            </a>
            <a
              href="#reading-list"
              className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Shelf &amp; Orders
            </a>
          </nav>

          {/* Zone 3: 1 primary action (Shopping Bag) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-medium text-white bg-[#881337] rounded-md hover:bg-[#9F1239] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-mono tabular-nums">Bag ({totalCartCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-[#E5DFD3] text-[#1C1917] hover:bg-[#F3EFE7] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FBF9F5] border-t border-[#E5DFD3] px-6 py-4 space-y-2">
            <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
              <a
                href="#featured"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center text-sm font-medium text-[#1C1917]"
              >
                Featured Book
              </a>
              <a
                href="#library"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center text-sm font-medium text-[#1C1917]"
              >
                Bookshop
              </a>
              <a
                href="#reader"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center text-sm font-medium text-[#1C1917]"
              >
                Reader
              </a>
              <a
                href="#reading-list"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center text-sm font-medium text-[#1C1917]"
              >
                Shelf &amp; Orders
              </a>
            </nav>
          </div>
        )}
      </header>

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 bg-[#1C1917] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-md shadow-lg border border-white/10"
        >
          {toastMessage}
        </div>
      )}

      <main className="flex-1">
        {/* Section 1: Featured Book Hero (WARUNI SANHITHAKA MALAWA) */}
        <section id="featured" className="bg-white border-b border-[#E5DFD3]">
          <div className="max-w-[1200px] mx-auto px-6 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
              {/* Left Editorial Narrative */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#57534E]">
                    <span className="font-medium text-[#881337]">Featured Release</span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredBook.genre}</span>
                    <span aria-hidden="true">·</span>
                    <span>By {featuredBook.author}</span>
                  </div>

                  <h1 className="font-editorial text-[clamp(2.25rem,4.2vw,3.75rem)] font-semibold tracking-tight leading-[1.1] text-[#1C1917] [text-wrap:balance]">
                    {featuredBook.title}
                  </h1>

                  <p className="font-editorial italic text-lg sm:text-xl text-[#57534E] leading-relaxed max-w-[54ch]">
                    “{featuredBook.pullQuote}”
                  </p>

                  <p className="text-base leading-[1.7] text-[#44403C] max-w-[62ch]">
                    {featuredBook.synopsis}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => openInReader(featuredBook.id, 0)}
                      className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 text-sm font-medium text-white bg-[#881337] rounded-md hover:bg-[#9F1239] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] whitespace-nowrap shrink-0"
                    >
                      <span>Read Chapter I Online</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPurchaseBook(featuredBook)}
                      className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-sm font-medium text-[#1C1917] bg-[#F3EFE7] border border-[#D6CEBE] rounded-md hover:bg-[#E5DFD3]/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] whitespace-nowrap shrink-0"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#881337]" />
                      <span className="font-mono tabular-nums">
                        Order Print / eBook ·{' '}
                        {formatPrice(
                          featuredPaperback.priceLKR,
                          featuredPaperback.priceUSD,
                          currency
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Clean Metadata Strip */}
                  <div className="pt-6 border-t border-[#E5DFD3] grid grid-cols-2 sm:grid-cols-4 gap-5">
                    <div>
                      <p className="font-mono text-lg font-medium tabular-nums text-[#1C1917]">
                        {featuredBook.chapters.length} Chapters
                      </p>
                      <p className="text-xs text-[#57534E]">Free Online Preview</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-medium tabular-nums text-[#1C1917]">
                        {featuredBook.pages} Pages
                      </p>
                      <p className="text-xs text-[#57534E]">Hardcover &amp; Paperback</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-medium tabular-nums text-[#1C1917]">
                        {formatPrice(
                          featuredBook.editions[2].priceLKR,
                          featuredBook.editions[2].priceUSD,
                          currency
                        )}
                      </p>
                      <p className="text-xs text-[#57534E]">Digital eBook Edition</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-medium tabular-nums text-[#1C1917]">
                        Free Delivery
                      </p>
                      <p className="text-xs text-[#57534E]">Orders over LKR 5,000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Gallery Frame for Uploaded Book Cover */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <figure className="h-full flex flex-col justify-between bg-[#F3EFE7] border border-[#E5DFD3] rounded-lg p-5 sm:p-6">
                  <div className="mx-auto w-full max-w-[360px] aspect-[2/3] rounded shadow-md overflow-hidden border border-[#D6CEBE] bg-white">
                    <ResilientImage
                      src="/assets/aistudio/Waruni__A_Romantic_Parkside_Stroll_390b363e.png"
                      alt="WARUNI SANHITHAKA MALAWA — Romantic Love Story by Dr. DN Wickramasinghe book cover"
                      fallbackTitle="WARUNI SANHITHAKA MALAWA"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 pt-3 border-t border-[#E5DFD3] text-xs font-editorial italic text-[#57534E] text-center">
                    Fig. 1 — Illustrated cover edition of WARUNI SANHITHAKA MALAWA by Dr. DN Wickramasinghe.
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Online Bookshop & Reading Library */}
        <section id="library" className="py-16 lg:py-20 border-b border-[#E5DFD3]">
          <div className="max-w-[1200px] mx-auto px-6 space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <p className="text-xs font-medium text-[#881337]">
                  Online Bookshop &amp; Library
                </p>
                <h2 className="font-editorial text-[28px] sm:text-[34px] font-semibold tracking-tight leading-tight text-[#1C1917] [text-wrap:balance]">
                  Read online or order signed print and digital editions.
                </h2>
              </div>

              {/* Search, Currency Switch & Genre Filters */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#57534E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <label htmlFor="library-search" className="sr-only">
                    Search books
                  </label>
                  <input
                    id="library-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search title or genre..."
                    className="w-full sm:w-52 min-h-[40px] pl-9 pr-3 py-1.5 text-sm text-[#1C1917] bg-white border border-[#E5DFD3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#881337]"
                  />
                </div>

                {/* Currency Switcher */}
                <div
                  role="group"
                  aria-label="Select currency"
                  className="inline-flex items-center p-1 bg-[#F3EFE7] border border-[#E5DFD3] rounded-md self-start sm:self-auto"
                >
                  {(['LKR', 'USD'] as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      className={`min-h-[32px] px-2.5 py-1 font-mono text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                        currency === code
                          ? 'bg-white text-[#1C1917] shadow-xs'
                          : 'text-[#57534E] hover:text-[#1C1917]'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>

                <div
                  role="tablist"
                  aria-label="Filter books by genre"
                  className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F3EFE7] border border-[#E5DFD3] rounded-md"
                >
                  {GENRE_FILTERS.map((genre) => {
                    const isSelected = activeGenre === genre;
                    return (
                      <button
                        key={genre}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveGenre(genre)}
                        className={`min-h-[32px] px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] ${
                          isSelected
                            ? 'bg-white text-[#1C1917] shadow-xs'
                            : 'text-[#57534E] hover:text-[#1C1917]'
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="bg-white border border-[#E5DFD3] rounded-lg p-10 text-center space-y-3">
                <p className="font-editorial text-lg font-medium text-[#1C1917]">
                  No books match “{searchQuery}”.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveGenre('All Books');
                  }}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#881337] rounded-md hover:bg-[#9F1239] transition-colors"
                >
                  Reset Bookshop Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => {
                  const isActiveInReader = book.id === activeBook.id;
                  const isSaved = bookmarks.includes(book.id);
                  const paperback = book.editions[1] ?? book.editions[0];
                  const readCount = book.chapters.filter(
                    (ch) => completedChapters[`${book.id}:${ch.number}`]
                  ).length;

                  return (
                    <article
                      key={book.id}
                      className={`bg-white border rounded-lg overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 ${
                        isActiveInReader ? 'border-[#881337] shadow-sm' : 'border-[#E5DFD3]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setPurchaseBook(book)}
                        aria-label={`View editions and pricing for ${book.title}`}
                        className="p-4 bg-[#F3EFE7] border-b border-[#E5DFD3] text-left cursor-pointer group"
                      >
                        <div className="aspect-[2/3] w-full max-w-[210px] mx-auto rounded overflow-hidden shadow-sm">
                          <BookCoverPlate book={book} className="w-full h-full" />
                        </div>
                      </button>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2 text-xs text-[#57534E]">
                            <span className="truncate">{book.genre}</span>
                            <span className="font-mono tabular-nums shrink-0">{book.year}</span>
                          </div>
                          <h3 className="font-editorial text-lg font-semibold text-[#1C1917] leading-snug">
                            {book.title}
                          </h3>
                          <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">
                            {book.synopsis}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#E5DFD3] space-y-3">
                          <div className="flex items-baseline justify-between gap-2">
                            <div>
                              <p className="font-mono text-base font-semibold tabular-nums text-[#1C1917]">
                                {formatPrice(
                                  paperback.priceLKR,
                                  paperback.priceUSD,
                                  currency
                                )}
                              </p>
                              <p className="text-[11px] text-[#57534E]">
                                Paperback · eBook available
                              </p>
                            </div>
                            <span className="font-mono text-[11px] tabular-nums text-[#57534E]">
                              {readCount}/{book.chapters.length} read
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPurchaseBook(book)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 py-1.5 text-xs font-medium text-white bg-[#881337] rounded-md hover:bg-[#9F1239] transition-colors whitespace-nowrap"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Buy Edition</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openInReader(book.id, 0)}
                              aria-label={`Read ${book.title} online`}
                              title="Read online"
                              className="min-h-[38px] px-2.5 py-1.5 inline-flex items-center justify-center gap-1 text-xs font-medium rounded-md border border-[#E5DFD3] bg-[#FBF9F5] text-[#1C1917] hover:bg-[#F3EFE7] transition-colors whitespace-nowrap"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[#881337]" />
                              <span>Read</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleBookmark(book.id)}
                              aria-label={
                                isSaved
                                  ? `Remove ${book.title} from reading list`
                                  : `Save ${book.title} to reading list`
                              }
                              aria-pressed={isSaved}
                              className={`min-w-[38px] min-h-[38px] inline-flex items-center justify-center rounded-md border transition-colors ${
                                isSaved
                                  ? 'bg-[#F3EFE7] border-[#881337] text-[#881337]'
                                  : 'bg-white border-[#E5DFD3] text-[#57534E] hover:text-[#1C1917]'
                              }`}
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Interactive Online Book Reader */}
        <section id="reader" className="py-16 lg:py-20 bg-[#F3EFE7]/60 border-b border-[#E5DFD3]">
          <div className="max-w-[1200px] mx-auto px-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs font-medium text-[#881337]">Interactive Book Reader</p>
                <h2 className="font-editorial text-[28px] sm:text-[34px] font-semibold tracking-tight leading-tight text-[#1C1917]">
                  Read online with adjustable paper, type, and margin notes.
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#57534E]">
                <span>
                  Open: <span className="font-medium text-[#1C1917]">{activeBook.title}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPurchaseBook(activeBook)}
                  className="text-xs font-medium text-[#881337] hover:underline underline-offset-4"
                >
                  Order Print / eBook
                </button>
              </div>
            </div>

            <BookReader
              book={activeBook}
              chapterIndex={chapterIndex}
              onSelectChapter={setChapterIndex}
              isBookmarked={bookmarks.includes(activeBook.id)}
              onToggleBookmark={toggleBookmark}
              completedChapters={completedChapters}
              onToggleChapterComplete={toggleChapterComplete}
              notes={notes}
              onAddNote={addNote}
              onDeleteNote={deleteNote}
            />
          </div>
        </section>

        {/* Section 4: Personal Reading List & Order History */}
        <section id="reading-list" className="py-16 lg:py-20 bg-[#FBF9F5]">
          <div className="max-w-[1200px] mx-auto px-6 space-y-12">
            {/* Saved Books */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[#881337]">Personal Shelf</p>
                  <h2 className="font-editorial text-[28px] sm:text-[34px] font-semibold tracking-tight leading-tight text-[#1C1917]">
                    Your saved reading list.
                  </h2>
                </div>
                <p className="text-xs font-mono tabular-nums text-[#57534E]">
                  {savedBooks.length} {savedBooks.length === 1 ? 'book' : 'books'} saved ·{' '}
                  {notes.length} margin {notes.length === 1 ? 'note' : 'notes'}
                </p>
              </div>

              {savedBooks.length === 0 ? (
                <div className="bg-white border border-[#E5DFD3] rounded-lg p-8 text-center space-y-3">
                  <p className="font-editorial text-lg text-[#1C1917]">
                    Your personal reading list is currently empty.
                  </p>
                  <p className="text-sm text-[#57534E]">
                    Save any book from the bookshop or reader toolbar to keep your place here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedBooks.map((book) => {
                    const completedCount = book.chapters.filter(
                      (ch) => completedChapters[`${book.id}:${ch.number}`]
                    ).length;
                    const bookNoteCount = notes.filter((n) => n.bookId === book.id).length;

                    return (
                      <div
                        key={book.id}
                        className="bg-white border border-[#E5DFD3] rounded-lg p-5 sm:p-6 flex items-center gap-5"
                      >
                        <div className="w-20 sm:w-24 aspect-[2/3] shrink-0 rounded overflow-hidden border border-[#E5DFD3]">
                          <BookCoverPlate book={book} className="w-full h-full" />
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-[#57534E]">
                            <span>{book.genre}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {completedCount}/{book.chapters.length} chapters read
                            </span>
                          </div>
                          <h3 className="font-editorial text-lg font-semibold text-[#1C1917] truncate">
                            {book.title}
                          </h3>
                          <p className="text-xs text-[#57534E]">
                            By {book.author} · {bookNoteCount} saved{' '}
                            {bookNoteCount === 1 ? 'note' : 'notes'}
                          </p>

                          <div className="pt-2 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => openInReader(book.id, 0)}
                              className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#881337] rounded-md hover:bg-[#9F1239] transition-colors whitespace-nowrap"
                            >
                              Open in Reader
                            </button>
                            <button
                              type="button"
                              onClick={() => setPurchaseBook(book)}
                              className="px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#F3EFE7] border border-[#E5DFD3] rounded-md hover:bg-[#E5DFD3]/70 transition-colors whitespace-nowrap"
                            >
                              Buy Copy
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleBookmark(book.id)}
                              className="px-2.5 py-1.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] transition-colors whitespace-nowrap"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Bookshop Orders */}
            {orders.length > 0 && (
              <div className="pt-10 border-t border-[#E5DFD3] space-y-5">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#881337]" />
                  <h3 className="font-editorial text-xl font-semibold text-[#1C1917]">
                    Recent Bookshop Orders
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.map((order) => (
                    <div
                      key={order.orderNumber}
                      className="bg-white border border-[#E5DFD3] rounded-lg p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-mono tabular-nums">
                        <span className="font-semibold text-[#14532D]">
                          Order #{order.orderNumber} Confirmed
                        </span>
                        <span className="text-[#57534E]">{order.placedAt}</span>
                      </div>
                      <p className="text-sm font-medium text-[#1C1917]">{order.itemsSummary}</p>
                      <p className="text-xs text-[#57534E]">
                        {order.paymentMethod} · {order.addressLine}
                      </p>
                      <p className="font-mono text-sm font-semibold tabular-nums text-[#881337] pt-1">
                        {order.totalFormatted}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-[#E5DFD3]">
        <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="font-editorial text-base font-semibold text-[#1C1917]">
              DR. DN WICKRAMASINGHE
            </p>
            <p className="text-xs text-[#57534E]">
              Literary Reading Room &amp; Online Bookshop · Featuring WARUNI SANHITHAKA MALAWA
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#57534E]"
          >
            <a href="#featured" className="hover:text-[#1C1917] transition-colors">
              Featured Book
            </a>
            <a href="#library" className="hover:text-[#1C1917] transition-colors">
              Bookshop
            </a>
            <a href="#reader" className="hover:text-[#1C1917] transition-colors">
              Reader
            </a>
            <a href="#reading-list" className="hover:text-[#1C1917] transition-colors">
              Shelf &amp; Orders
            </a>
          </nav>

          <p className="text-xs text-[#57534E] font-mono tabular-nums">
            © {new Date().getFullYear()} Dr. DN Wickramasinghe
          </p>
        </div>
      </footer>

      <BookPurchaseModal
        book={purchaseBook}
        currency={currency}
        onClose={() => setPurchaseBook(null)}
        onAddToBag={handleAddToBag}
        onOpenReader={(id) => openInReader(id, 0)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        currency={currency}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderConfirmed={handleOrderConfirmed}
      />
    </div>
  );
}
