import getCategoriesService from "@/services/getCategoriesService";
import CategoriesSection from "./_component/home/CategoriesSection";
import HeroSection from "./_component/home/HeroSection";

import getFeaturedProperties from "@/services/getFeaturedProperties";
import FeaturedProperties from "./_component/home/FeaturedProperties";
import HowItWorks from "./_component/home/HowItWorks";
import LandlordCTA from "./_component/home/LandlordCTA";
import PopularLocations from "./_component/home/PopularLocations";
import Testimonials from "./_component/home/Testimonials";
import TrustBar from "./_component/home/TrustBar";
import WhyChooseUs from "./_component/home/WhyChooseUs";

export default async function HomePage() {
  const categories = await getCategoriesService();
  const properties = await getFeaturedProperties();
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoriesSection categories={categories} />
      <FeaturedProperties properties={properties} />
      <WhyChooseUs />
      <HowItWorks />
      <PopularLocations />
      <Testimonials />
      <LandlordCTA />
    </>
  );
}
