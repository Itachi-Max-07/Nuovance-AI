import About from "@/components/sections/About";
import BusinessOutcomes from "@/components/sections/BusinessOutcomes";
import Capabilities from "@/components/sections/Capabilities";
import Closing from "@/components/sections/Closing";
import Contact from "@/components/sections/Contact";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Industries from "@/components/sections/Industries";
import Leadership from "@/components/sections/Leadership";
import Methodology from "@/components/sections/Methodology";
import TechEcosystem from "@/components/sections/TechEcosystem";
import VisionMission from "@/components/sections/VisionMission";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import WorkflowStory from "@/components/sections/WorkflowStory";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Dark Soft Brutalism scope: re-points the brand tokens (globals.css)
          at the charcoal-black system for every section below the Hero. The
          Hero above reads the untouched :root values. */}
      <div className="theme-dark bg-brand-paper">
        <About />
        <WorkflowStory />
        <VisionMission />
        <Capabilities />
        <Experience />
        <BusinessOutcomes />
        <Industries />
        <Methodology />
        <Leadership />
        <TechEcosystem />
        <WhyChooseUs />
        <Contact />
        <Closing />
      </div>
    </>
  );
}
