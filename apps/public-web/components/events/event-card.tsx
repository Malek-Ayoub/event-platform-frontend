import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@event-platform/ui';
import type { EventCardViewModel } from '@/components/events/events.query';

export type EventCardProps = EventCardViewModel;

function EventCardImage({ title, imageUrl }: Pick<EventCardProps, 'title' | 'imageUrl'>) {
  if (imageUrl) {
    return (
      <img src={imageUrl} alt="" aria-hidden="true" className="aspect-[16/9] w-full object-cover" />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex aspect-[16/9] w-full items-center justify-center bg-primary text-4xl font-semibold text-primary-foreground"
    >
      {title.charAt(0)}
    </div>
  );
}

export function EventCard({
  id,
  slug,
  title,
  venue,
  imageUrl,
  startDatetime,
  dateLabel,
  priceLabel,
}: EventCardProps) {
  return (
    <article data-event-id={id} data-slug={slug}>
      <Link href={`/events/${slug}`} className="block" aria-label={`View event: ${title}`}>
        <Card className="h-full overflow-hidden">
          <EventCardImage title={title} imageUrl={imageUrl} />
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">{venue}</p>
            <time className="text-sm text-muted-foreground" dateTime={startDatetime}>
              {dateLabel}
            </time>
            <p className="text-sm font-medium">{priceLabel}</p>
          </CardContent>
        </Card>
      </Link>
    </article>
  );
}
