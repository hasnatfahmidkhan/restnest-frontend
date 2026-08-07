import getCategoriesService from "@/services/getCategoriesService";
import CategoriesSection from "./_component/home/CategoriesSection";
import HeroSection from "./_component/home/HeroSection";

import getFeaturedProperties from "@/services/getFeaturedProperties";
import { getPopularLocations } from "./_actions/home";
import FeaturedProperties from "./_component/home/FeaturedProperties";
import HowItWorks from "./_component/home/HowItWorks";
import LandlordCTA from "./_component/home/LandlordCTA";
import PopularLocations from "./_component/home/PopularLocations";
import Testimonials from "./_component/home/Testimonials";
import TrustBar from "./_component/home/TrustBar";
import VerifiedGuarantee from "./_component/home/VerifiedGuarantee";
import WhyChooseUs from "./_component/home/WhyChooseUs";

export default async function HomePage() {
  const categories = await getCategoriesService();
  const properties = await getFeaturedProperties();
  const popularLocations = await getPopularLocations();

  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoriesSection categories={categories} />
      <FeaturedProperties properties={properties} />
      <VerifiedGuarantee />
      <WhyChooseUs />
      <HowItWorks />
      <PopularLocations locations={popularLocations} />
      <Testimonials />
      <LandlordCTA />
    </>
  );
}
