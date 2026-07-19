import { VenueDetailPage } from '@/components/venues/venue-detail-page';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const venueId = Number.parseInt(id, 10);

  return <VenueDetailPage venueId={Number.isFinite(venueId) ? venueId : 0} />;
}
