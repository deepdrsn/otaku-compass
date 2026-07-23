import Hero from "@/components/home/Hero";
import TrendingCarousel from "@/components/home/TrendingCarousel";
import ParticleField from "@/components/home/ParticleField";
import MouseGlow from "@/components/home/MouseGlow";
import CollectionsGrid from "@/components/home/CollectionsGrid";
import StatsBanner from "@/components/home/StatsBanner";

export default function HomePage() {
  return (
    <div className="relative">
      <ParticleField />
      <MouseGlow />
      <div className="relative z-10">
        <Hero />
        <StatsBanner />
        <TrendingCarousel />
        <CollectionsGrid />
      </div>
    </div>
  );
}
