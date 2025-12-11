import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { Pricing } from "@/components/landing/Pricing";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Services />
      <Pricing />
    </div>
  )
}
