import useTitle from "../../hooks/useChangePageTitle";
import AllPlacesSection from "./AllPlaces/AllPlacesSection";
import HeroSection from "./hero section/HeroSection";

export default function HomePage() {
  useTitle("Home - Explore Places");
  return (
    <div>
      <HeroSection />
      <AllPlacesSection />
    </div>
  );
}
