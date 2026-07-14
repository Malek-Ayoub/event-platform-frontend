'use client';

import Link from 'next/link';
import { useTenant } from '@event-platform/tenant';
import { Button } from '@event-platform/ui';
import { Container, Section } from '@event-platform/ui/layout';
import type { LandingSectionProps } from '@/components/landing/types';

function getHeroDescription(tenantName: string): string {
  return `Discover and book events with ${tenantName}.`;
}

export function HeroSection({ className }: LandingSectionProps) {
  const { branding } = useTenant();

  return (
    <Section spacing="lg" aria-label="Hero" className={className}>
      <Container>
        <div
          className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between"
          data-slot="hero-section-content"
        >
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{branding.name}</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              {getHeroDescription(branding.name)}
            </p>
            <Button asChild>
              <Link href="/events">Browse events</Link>
            </Button>
          </div>
          <div className="flex shrink-0 items-center justify-center">
            {branding.logo ? (
              <img
                src={branding.logo}
                alt={branding.name}
                className="h-32 w-32 rounded-2xl border border-border object-cover md:h-40 md:w-40"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-32 w-32 items-center justify-center rounded-2xl bg-primary text-4xl font-semibold text-primary-foreground md:h-40 md:w-40"
              >
                {branding.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
