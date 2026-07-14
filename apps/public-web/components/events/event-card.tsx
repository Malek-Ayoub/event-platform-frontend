import { Card, CardContent, CardHeader, CardTitle } from '@event-platform/ui';

export type EventCardProps = {
  title: string;
  venue: string;
  date: string;
  price: string;
};

export function EventCard({ title, venue, date, price }: EventCardProps) {
  return (
    <article>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm text-muted-foreground">{venue}</p>
          <p className="text-sm text-muted-foreground">{date}</p>
          <p className="text-sm font-medium">{price}</p>
        </CardContent>
      </Card>
    </article>
  );
}
