export type SectionEmptyStateProps = {
  sectionName: string;
  title: string;
  description?: string;
};

export function SectionEmptyState({ sectionName, title, description }: SectionEmptyStateProps) {
  return (
    <div className="max-w-2xl space-y-2" data-slot={`${sectionName}-empty-state`} role="status">
      <p className="text-lg font-semibold tracking-tight">{title}</p>
      {description ? <p className="text-muted-foreground">{description}</p> : null}
    </div>
  );
}
