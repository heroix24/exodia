import { Button } from "@/components/ui/button";
import { Safari } from "@/components/ui/safari";

export function HeroSection() {
  return (
    <section className="mx-4 md:mx-auto max-w-[1000px] overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 px-4 md:px-5 py-8 md:py-10">
        <div className="flex flex-col gap-6 md:gap-8 max-w-full lg:max-w-[387px] text-center lg:text-left">
          <h1
            className="font-bold text-3xl md:text-4xl leading-tight"
            style={{ fontFamily: "var(--font-edu-tas-beginner), cursive" }}
          >
            <span className="text-[#0d7239]">Excel</span> to{" "}
            <span className="text-[#0d7239]">Real Web App</span>
            <br />
            in One Click
          </h1>
          <p className="text-[#0d7239] text-sm md:text-base font-medium leading-relaxed">
            Turn the spreadsheets you already trust into living, interactive
            applications — without code, setup, or developers.
          </p>
          <Button className="w-full sm:w-fit mx-auto lg:mx-0 bg-[#0d7239] px-4 py-4 text-sm md:text-base font-semibold text-[#fff6ed] hover:bg-[#0a5c2d]">
            Start Convert Sheets
          </Button>
        </div>
        <div className="relative w-full lg:w-auto">
          {/* Progressive blur circle - multiple layers for smooth falloff */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Outer soft glow */}
            <div className="absolute w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(180,210,180,0.3)_0%,rgba(180,210,180,0)_70%)] blur-[60px]" />
            {/* Mid layer */}
            <div className="absolute w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(169,199,169,0.4)_0%,rgba(169,199,169,0)_60%)] blur-[40px]" />
            {/* Inner concentrated glow */}
            <div className="absolute w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(158,189,158,0.5)_0%,rgba(158,189,158,0)_50%)] blur-[25px]" />
            {/* Core subtle tint */}
            <div className="absolute w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(148,179,148,0.35)_0%,rgba(148,179,148,0)_70%)] blur-[15px]" />
          </div>
          <div className="relative w-full max-w-[480px] mx-auto aspect-square lg:w-[480px] lg:h-[450px] flex items-center justify-center p-4 md:p-0">
            <Safari
              url="exodia.app"
              youtubeSrc="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="w-full max-w-[480px] shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
