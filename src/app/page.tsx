import About from "@/components/sections/About";
import Capabilities from "@/components/sections/Capabilities";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import VisionMission from "@/components/sections/VisionMission";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <VisionMission />
      <Experience />
      <Capabilities />
    </>
  );
}
