import { formatCurrency, formatDateTime } from '@event-platform/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@event-platform/ui';

export type EventCardProps = {
  id: string;
  slug: string;
  title: string;
  venue: string;
  imageUrl: string | null;
  startDatetime: string;
  price: { amount: number; currency: string } | null;
};

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

function formatEventPrice(price: EventCardProps['price']): string {
  if (price === null) {
    return 'Free';
  }

  return formatCurrency(price.amount, price.currency);
}

export function EventCard({
  id,
  slug,
  title,
  venue,
  imageUrl,
  startDatetime,
  price,
}: EventCardProps) {
  return (
    <article data-event-id={id} data-slug={slug}>
      <Card className="h-full overflow-hidden">
        <EventCardImage title={title} imageUrl={imageUrl} />
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm text-muted-foreground">{venue}</p>
          <time className="text-sm text-muted-foreground" dateTime={startDatetime}>
            {formatDateTime(startDatetime)}
          </time>
          <p className="text-sm font-medium">{formatEventPrice(price)}</p>
        </CardContent>
      </Card>
    </article>
  );
}
