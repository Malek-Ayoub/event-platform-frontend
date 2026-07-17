import { CheckoutPage } from '@/components/events/checkout-page';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ items?: string | string[] }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const rawItems = Array.isArray(resolvedSearchParams.items)
    ? resolvedSearchParams.items[0]
    : resolvedSearchParams.items;

  return <CheckoutPage slug={slug} rawItems={rawItems} />;
}
