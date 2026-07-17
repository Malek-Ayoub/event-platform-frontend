import { PaymentPage } from '@/components/payments/payment-page';

export default async function Page({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;

  return <PaymentPage orderNumber={orderNumber} />;
}
