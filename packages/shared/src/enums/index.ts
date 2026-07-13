/** Mirrors `App\Enums\OrdersDomain\OrderStatus`. */
export const OrderStatus = {
  Pending: 'pending',
  Paid: 'paid',
  Failed: 'failed',
  Refunded: 'refunded',
  Cancelled: 'cancelled',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

/** Mirrors `App\Enums\OrdersDomain\TicketStatus`. */
export const TicketStatus = {
  Issued: 'issued',
  CheckedIn: 'checked_in',
  Cancelled: 'cancelled',
  Refunded: 'refunded',
  Invalidated: 'invalidated',
} as const;

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

/** Mirrors `App\Enums\EventDomain\EventStatus`. */
export const EventStatus = {
  Draft: 'draft',
  Published: 'published',
  Cancelled: 'cancelled',
  Completed: 'completed',
} as const;

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];

/** Mirrors `App\Enums\FinancialDomain\PaymentTransactionStatus`. */
export const PaymentTransactionStatus = {
  Pending: 'pending',
  Completed: 'completed',
  Refunded: 'refunded',
  Failed: 'failed',
  AwaitingTransfer: 'awaiting_transfer',
  Verifying: 'verifying',
  Paid: 'paid',
  Expired: 'expired',
} as const;

export type PaymentTransactionStatus =
  (typeof PaymentTransactionStatus)[keyof typeof PaymentTransactionStatus];

/** Mirrors `App\Enums\FinancialDomain\RefundStatus`. */
export const RefundStatus = {
  Pending: 'pending',
  Processed: 'processed',
  Failed: 'failed',
} as const;

export type RefundStatus = (typeof RefundStatus)[keyof typeof RefundStatus];

/** Mirrors `App\Enums\Payments\PaymentWalletProvider`. */
export const PaymentWalletProvider = {
  ShamCash: 'shamcash',
  Syriatel: 'syriatel',
} as const;

export type PaymentWalletProvider =
  (typeof PaymentWalletProvider)[keyof typeof PaymentWalletProvider];
