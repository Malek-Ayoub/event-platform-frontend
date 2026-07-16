import { EventDetailPage } from '@/components/events/event-detail-page';

export default function Page({ params }: { params: { slug: string } }) {
  return <EventDetailPage slug={params.slug} />;
}
