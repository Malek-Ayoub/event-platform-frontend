import { Container, Section } from '@event-platform/ui/layout';
import { EventCard } from '@/components/events/event-card';

const PLACEHOLDER_EVENTS = [
  {
    id: '1',
    slug: 'summer-jazz-night',
    title: 'Summer Jazz Night',
    venue: 'Harborview Pavilion',
    imageUrl: 'https://picsum.photos/seed/summer-jazz/640/360',
    startDatetime: '2026-08-15T19:30:00.000Z',
    price: { amount: 45, currency: 'USD' },
  },
  {
    id: '2',
    slug: 'tech-forward-summit',
    title: 'Tech Forward Summit',
    venue: 'The Loft at Market Street',
    imageUrl: 'https://picsum.photos/seed/tech-summit/640/360',
    startDatetime: '2026-09-20T09:00:00.000Z',
    price: { amount: 120, currency: 'USD' },
  },
  {
    id: '3',
    slug: 'harvest-food-wine-festival',
    title: 'Harvest Food & Wine Festival',
    venue: 'Cedar Hall',
    imageUrl: null,
    startDatetime: '2026-10-05T17:00:00.000Z',
    price: null,
  },
];

export function EventsGridPlaceholder() {
  return (
    <Section spacing="lg" variant="muted" aria-label="Events list">
      <Container>
        <ul
          className="grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3"
          data-slot="events-grid-placeholder-content"
        >
          {PLACEHOLDER_EVENTS.map((event) => (
            <li key={event.id}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
