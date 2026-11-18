import { useEffect, useState } from 'react';
import { Check, Copy, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import {
  formatPrice,
  type Book,
  type BookEdition,
  type CurrencyCode,
} from '../data/booksData';
import { BookCoverPlate } from './BookCoverPlate';

export interface CartItem {
  book: Book;
  edition: BookEdition;
  quantity: number;
}

export interface OrderRecord {
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  paymentMethod: 'Cash on Delivery (COD)' | 'Bank Transfer / Card Link';
  addressLine: string;
  itemsSummary: string;
  totalFormatted: string;
  hasPhysicalItems: boolean;
  placedAt: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  currency: CurrencyCode;
  onClose: () => void;
  onUpdateQuantity: (editionId: string, delta: number) => void;
  onRemoveItem: (editionId: string) => void;
  onClearCart: () => void;
  onOrderConfirmed: (order: OrderRecord) => void;
}

interface CheckoutErrors {
  customerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
}

export function CartDrawer({
  isOpen,
  items,
  currency,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderConfirmed,
}: CartDrawerProps) {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'Cash on Delivery (COD)' | 'Bank Transfer / Card Link'
  >('Cash on Delivery (COD)');
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && items.length > 0 && step === 'confirmed') {
      setStep('bag');
    }
  }, [isOpen, items.length, step]);

  if (!isOpen) return null;

  const hasPhysicalItems = items.some((item) => item.edition.format !== 'eBook');

  const subtotalLKR = items.reduce(
    (sum, item) => sum + item.edition.priceLKR * item.quantity,
    0
  );
  const subtotalUSD = items.reduce(
    (sum, item) => sum + item.edition.priceUSD * item.quantity,
    0
  );

  const qualifiesFreeDelivery = !hasPhysicalItems || subtotalLKR >= 5000;
  const deliveryLKR = qualifiesFreeDelivery ? 0 : 450;
  const deliveryUSD = qualifiesFreeDelivery ? 0 : 3.5;

  const totalLKR = subtotalLKR + deliveryLKR;
  const totalUSD = subtotalUSD + deliveryUSD;

  const freeShippingRemainingLKR = Math.max(0, 5000 - subtotalLKR);
  const freeShippingRemainingUSD = Math.max(0, 26 - subtotalUSD);

  const validateCheckout = (): CheckoutErrors => {
    const next: CheckoutErrors = {};
    if (customerName.trim().length < 2) {
      next.customerName = 'Please enter recipient full name.';
    }
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    if (!/^\+?\d{9,15}$/.test(cleanPhone)) {
      next.phone = 'Enter a valid phone number (9–15 digits).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email address for your receipt.';
    }
    if (hasPhysicalItems && address.trim().length < 5) {
      next.address = 'Enter a complete street delivery address.';
    }
    if (hasPhysicalItems && city.trim().length < 2) {
      next.city = 'Enter city or district.';
    }
    return next;
  };

  const handleCheckoutSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validateCheckout();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const orderNum = `DNW-${Math.floor(1000 + Math.random() * 9000)}`;
    const summary = items
      .map((i) => `${i.quantity}x ${i.book.title} (${i.edition.format})`)
      .join(', ');

    const newOrder: OrderRecord = {
      orderNumber: orderNum,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      paymentMethod,
      addressLine: hasPhysicalItems
        ? `${address.trim()}, ${city.trim()}${postalCode.trim() ? ` ${postalCode.trim()}` : ''}`
        : `Digital delivery to ${email.trim()}`,
      itemsSummary: summary,
      totalFormatted: formatPrice(totalLKR, totalUSD, currency),
      hasPhysicalItems,
      placedAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    setConfirmedOrder(newOrder);
    onOrderConfirmed(newOrder);
    onClearCart();
    setStep('confirmed');
  };

  const handleCopyReceipt = async () => {
    if (!confirmedOrder) return;
    const text = `Order #${confirmedOrder.orderNumber} Confirmed | ${confirmedOrder.itemsSummary} | Total: ${confirmedOrder.totalFormatted} | ${confirmedOrder.paymentMethod}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 2000);
    } catch {
      setCopiedReceipt(false);
    }
  };

  const handleContinueShopping = () => {
    setStep('bag');
    setConfirmedOrder(null);
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1C1917]/50"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag and checkout"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FBF9F5] h-full border-l border-[#E5DFD3] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E5DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#881337]" />
            <h3 className="font-editorial text-lg font-semibold text-[#1C1917]">
              {step === 'bag' && 'Bookshop Bag'}
              {step === 'checkout' && 'Delivery & Payment Verification'}
              {step === 'confirmed' && 'Order Confirmation'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="min-w-[38px] min-h-[38px] inline-flex items-center justify-center rounded-md border border-[#E5DFD3] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3EFE7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'confirmed' && confirmedOrder ? (
            <div className="bg-white border border-[#E5DFD3] rounded-lg p-6 space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E5DFD3]">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#14532D] mb-1.5">
                    <Check className="w-4 h-4" />
                    <span>Order #{confirmedOrder.orderNumber} Confirmed</span>
                  </div>
                  <h4 className="font-editorial text-xl font-semibold text-[#1C1917]">
                    Thank you, {confirmedOrder.customerName}
                  </h4>
                </div>
                <span className="font-mono text-xs tabular-nums text-[#57534E]">
                  {confirmedOrder.placedAt}
                </span>
              </div>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs text-[#57534E]">Books Ordered</dt>
                  <dd className="font-medium text-[#1C1917] mt-0.5">
                    {confirmedOrder.itemsSummary}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#57534E]">
                    {confirmedOrder.hasPhysicalItems ? 'Delivery Address' : 'Digital Delivery'}
                  </dt>
                  <dd className="text-[#1C1917] mt-0.5">{confirmedOrder.addressLine}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E5DFD3]">
                  <div>
                    <dt className="text-xs text-[#57534E]">Payment Method</dt>
                    <dd className="font-medium text-[#1C1917] mt-0.5">
                      {confirmedOrder.paymentMethod}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#57534E]">Order Total</dt>
                    <dd className="font-mono font-semibold tabular-nums text-[#881337] mt-0.5">
                      {confirmedOrder.totalFormatted}
                    </dd>
                  </div>
                </div>
              </dl>

              <p className="text-xs text-[#57534E] leading-relaxed">
                {confirmedOrder.hasPhysicalItems
                  ? `Preparing shipment from Colombo Bookshop Dispatch. SMS updates will be sent to ${confirmedOrder.phone}.`
                  : `Your DRM-free EPUB & PDF editions have been queued for ${confirmedOrder.email}.`}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyReceipt}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1C1917] bg-[#F3EFE7] border border-[#E5DFD3] rounded-md hover:bg-[#E5DFD3]/60 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedReceipt ? 'Receipt Copied' : 'Copy Receipt'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleContinueShopping}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#881337] rounded-md hover:bg-[#9F1239] transition-colors"
                >
                  Continue Reading &amp; Shopping
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <ShoppingBag className="w-10 h-10 text-[#D6CEBE]" strokeWidth={1.5} />
              <div className="space-y-1">
                <p className="font-editorial text-lg font-medium text-[#1C1917]">
                  Your bookshop bag is empty.
                </p>
                <p className="text-sm text-[#57534E] max-w-xs">
                  Choose a hardcover, paperback, or digital edition from Dr. DN Wickramasinghe’s
                  collection to place an order.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-white bg-[#881337] rounded-md hover:bg-[#9F1239] transition-colors"
              >
                Browse Bookshop
              </button>
            </div>
          ) : step === 'bag' ? (
            <div className="space-y-5">
              {/* Free Shipping Progress Notice */}
              {hasPhysicalItems && (
                <div className="p-3.5 bg-[#F3EFE7] border border-[#E5DFD3] rounded-md text-xs text-[#44403C]">
                  {qualifiesFreeDelivery ? (
                    <span className="font-medium text-[#14532D]">
                      Your order qualifies for complimentary island-wide book delivery.
                    </span>
                  ) : (
                    <span>
                      Add{' '}
                      <span className="font-mono font-medium tabular-nums text-[#1C1917]">
                        {formatPrice(freeShippingRemainingLKR, freeShippingRemainingUSD, currency)}
                      </span>{' '}
                      more for complimentary print delivery (Free over LKR 5,000).
                    </span>
                  )}
                </div>
              )}

              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.edition.id}
                    className="bg-white border border-[#E5DFD3] rounded-lg p-4 flex gap-4"
                  >
                    <div className="w-16 aspect-[2/3] shrink-0 rounded overflow-hidden border border-[#E5DFD3]">
                      <BookCoverPlate book={item.book} className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-editorial text-sm font-semibold text-[#1C1917] truncate">
                            {item.book.title}
                          </h4>
                          <p className="text-xs text-[#57534E]">{item.edition.label}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.edition.id)}
                          aria-label={`Remove ${item.book.title}`}
                          className="text-[#57534E] hover:text-[#881337] p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="inline-flex items-center border border-[#E5DFD3] rounded bg-[#FBF9F5]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.edition.id, -1)}
                            aria-label="Decrease item quantity"
                            className="min-w-[30px] min-h-[30px] inline-flex items-center justify-center text-[#57534E] hover:text-[#1C1917]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 font-mono text-xs tabular-nums text-[#1C1917]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.edition.id, 1)}
                            aria-label="Increase item quantity"
                            className="min-w-[30px] min-h-[30px] inline-flex items-center justify-center text-[#57534E] hover:text-[#1C1917]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-sm font-semibold tabular-nums text-[#1C1917]">
                          {formatPrice(
                            item.edition.priceLKR * item.quantity,
                            item.edition.priceUSD * item.quantity,
                            currency
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <form id="bookshop-checkout-form" onSubmit={handleCheckoutSubmit} noValidate className="space-y-4">
              <div>
                <p className="text-xs font-medium text-[#57534E] mb-2">Payment Method</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(
                    [
                      'Cash on Delivery (COD)',
                      'Bank Transfer / Card Link',
                    ] as const
                  ).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 text-left text-xs font-medium rounded-md border transition-colors ${
                        paymentMethod === method
                          ? 'bg-white border-[#881337] text-[#1C1917] shadow-xs'
                          : 'bg-white/60 border-[#E5DFD3] text-[#57534E] hover:bg-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="checkout-name" className="block text-xs font-medium text-[#44403C] mb-1">
                  Full Name *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors({ ...errors, customerName: undefined });
                  }}
                  placeholder="Recipient full name"
                  className="w-full min-h-[40px] px-3 py-2 text-sm bg-white border border-[#D6CEBE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#881337]"
                />
                {errors.customerName && (
                  <p className="mt-1 text-xs text-[#991B1B]">{errors.customerName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="checkout-phone" className="block text-xs font-medium text-[#44403C] mb-1">
                    Phone (SMS Confirmation) *
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    placeholder="+94 77 123 4567"
                    className="w-full min-h-[40px] px-3 py-2 text-sm font-mono tabular-nums bg-white border border-[#D6CEBE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#881337]"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-[#991B1B]">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-email" className="block text-xs font-medium text-[#44403C] mb-1">
                    Email (Order Receipt) *
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="reader@example.com"
                    className="w-full min-h-[40px] px-3 py-2 text-sm bg-white border border-[#D6CEBE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#881337]"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#991B1B]">{errors.email}</p>
                  )}
                </div>
              </div>

              {hasPhysicalItems && (
                <>
                  <div>
                    <label htmlFor="checkout-address" className="block text-xs font-medium text-[#44403C] mb-1">
                      Delivery Street Address *
                    </label>
                    <input
                      id="checkout-address"
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) setErrors({ ...errors, address: undefined });
                      }}
                      placeholder="House / Street / Apartment"
                      className="w-full min-h-[40px] px-3 py-2 text-sm bg-white border border-[#D6CEBE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#881337]"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-[#991B1B]">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="checkout-city" className="block text-xs font-medium text-[#44403C] mb-1">
                        City / District *
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (errors.city) setErrors({ ...errors, city: undefined });
                        }}
                        placeholder="Colombo 07"
                        className="w-full min-h-[40px] px-3 py-2 text-sm bg-white border border-[#D6CEBE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#881337]"
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-[#991B1B]">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="checkout-postal" className="block text-xs font-medium text-[#44403C] mb-1">
                        Postal Code
                      </label>
                      <input
                        id="checkout-postal"
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="00700"
                        className="w-full min-h-[40px] px-3 py-2 text-sm font-mono tabular-nums bg-white border border-[#D6CEBE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#881337]"
                      />
                    </div>
                  </div>
                </>
              )}
            </form>
          )}
        </div>

        {/* Drawer Footer Totals & Actions */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="p-6 bg-white border-t border-[#E5DFD3] space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-[#57534E]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#1C1917]">
                  {formatPrice(subtotalLKR, subtotalUSD, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#57534E]">
                <span>Delivery</span>
                <span className="font-mono tabular-nums text-[#1C1917]">
                  {qualifiesFreeDelivery
                    ? 'Free'
                    : formatPrice(deliveryLKR, deliveryUSD, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#E5DFD3] font-semibold text-[#1C1917]">
                <span>Total</span>
                <span className="font-mono text-base tabular-nums text-[#881337]">
                  {formatPrice(totalLKR, totalUSD, currency)}
                </span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full min-h-[44px] px-5 py-2.5 text-sm font-medium text-white bg-[#881337] rounded-md hover:bg-[#9F1239] transition-colors"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('bag')}
                  className="min-h-[44px] px-4 py-2 text-sm font-medium text-[#1C1917] bg-[#F3EFE7] border border-[#E5DFD3] rounded-md hover:bg-[#E5DFD3]/60 transition-colors"
                >
                  Back to Bag
                </button>
                <button
                  type="submit"
                  form="bookshop-checkout-form"
                  className="flex-1 min-h-[44px] px-5 py-2.5 text-sm font-medium text-white bg-[#881337] rounded-md hover:bg-[#9F1239] transition-colors"
                >
                  Confirm Order · {formatPrice(totalLKR, totalUSD, currency)}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
