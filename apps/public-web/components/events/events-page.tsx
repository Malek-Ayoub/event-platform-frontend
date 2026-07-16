import { EventsGrid } from '@/components/events/events-grid';
import { EventsHeader } from '@/components/events/events-header';

export function EventsPage() {
  return (
    <>
      <EventsHeader />
      <EventsGrid />
    </>
  );
}
