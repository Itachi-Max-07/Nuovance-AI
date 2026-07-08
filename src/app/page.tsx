import About from "@/components/sections/About";
import BusinessOutcomes from "@/components/sections/BusinessOutcomes";
import Capabilities from "@/components/sections/Capabilities";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Industries from "@/components/sections/Industries";
import Leadership from "@/components/sections/Leadership";
import Methodology from "@/components/sections/Methodology";
import VisionMission from "@/components/sections/VisionMission";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <VisionMission />
      <Capabilities />
      <Experience />
      <BusinessOutcomes />
      <Industries />
      <Methodology />
      <Leadership />
    </>
  );
}
