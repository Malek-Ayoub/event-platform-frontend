import { Container, Section } from '@event-platform/ui/layout';
import { EventCard } from '@/components/events/event-card';

const PLACEHOLDER_EVENTS = [
  {
    title: 'Summer Jazz Night',
    venue: 'Harborview Pavilion',
    date: 'Aug 15, 2026, 7:30 PM',
    price: 'From $45',
  },
  {
    title: 'Tech Forward Summit',
    venue: 'The Loft at Market Street',
    date: 'Sep 20, 2026, 9:00 AM',
    price: 'From $120',
  },
  {
    title: 'Harvest Food & Wine Festival',
    venue: 'Cedar Hall',
    date: 'Oct 5, 2026, 5:00 PM',
    price: 'From $65',
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
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
