import HeroSlider from "@/components/home/hero-slider";
import ServiceCards from "@/components/home/service-cards";
import ContentSections from "@/components/home/content-sections";
import Sidebar from "@/components/home/sidebar";

export default function Landing() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <HeroSlider />
          <ServiceCards />
          <ContentSections />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
