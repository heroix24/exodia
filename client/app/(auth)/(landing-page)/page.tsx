"use client";

import {
  Header,
  HeroSection,
  WaveDivider,
  ProblemSection,
  TransformSection,
  HowItWorksSection,
  TestimonialSection,
  PricingSection,
  CTASection,
  Footer,
  LargeTitle,
} from "@/app/(auth)/(landing-page)/components";

export default function LandingPage() {
  return (
    <div id="top" className="min-h-screen bg-[#fff6ed] text-[#424242]">
      <Header />
      <HeroSection />
      <WaveDivider />
      <HowItWorksSection />
      <WaveDivider />
      <TransformSection />
      <WaveDivider />
      <ProblemSection />
      <WaveDivider />
      <TestimonialSection
        quote="Working with this team changed the way we think about pricing and growth. We saw clarity, speed and real revenue movement within weeks."
        author="Sarah Chen"
        role="Operations Lead, TechCorp"
      />
      <WaveDivider />
      <PricingSection />
      <WaveDivider />
      <CTASection />
      <WaveDivider />
      <Footer />
      <LargeTitle />
    </div>
  );
}
