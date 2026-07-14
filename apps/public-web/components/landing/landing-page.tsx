import { CTASection } from '@/components/landing/cta-section';
import { FeaturedEventsSection } from '@/components/landing/featured-events-section';
import { HeroSection } from '@/components/landing/hero-section';
import { VenueHighlightsSection } from '@/components/landing/venue-highlights-section';

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturedEventsSection />
      <VenueHighlightsSection />
      <CTASection />
    </>
  );
}
