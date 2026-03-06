import { HeroSection }       from '@/components/home/HeroSection';
import { TrustBar }          from '@/components/home/TrustBar';
import { DealsSection }      from '@/components/home/DealsSection';
import { LastMinuteBanner }  from '@/components/home/LastMinuteBanner';
import { ReviewsCarousel }   from '@/components/home/ReviewsCarousel';


export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <DealsSection />
      <LastMinuteBanner />
      <ReviewsCarousel />
      
    </main>
  );
}
