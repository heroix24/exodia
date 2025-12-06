import { FeatureCard } from "./feature-card";

const howItWorks = [
  {
    title: "File Duplicate Check",
    description: "Excel files multiplied, renamed, and fragmented across teams",
  },
  {
    title: "Formula Breakage Fear",
    description: "Afraid to share or edit files due to formula destruction",
  },
  {
    title: "No Developer Access",
    description: "Can't afford or access developers to build proper tools",
  },
  {
    title: "Manual Time Waste",
    description: "Hours spent on manual data entry and updates",
  },
  {
    title: "File Duplicate Chaos",
    description: "Excel files outdated, misused, and dispersed across environments",
  },
];

export function HowItWorksSection() {
  return (
    <section className="mx-4 md:mx-auto max-w-[1000px] overflow-hidden px-4 md:px-5 py-6 md:py-8">
      <div className="flex flex-col gap-4 md:gap-5 items-center">
        <p className="text-[#0d7239] text-base md:text-lg font-medium uppercase tracking-wide">
          How It Works
        </p>
        <h2
          className="text-2xl md:text-4xl font-bold text-center"
          style={{ fontFamily: "'Edu TAS Beginner', cursive" }}
        >
          Five Steps to Your Web App
        </h2>
        <p className="text-[#424242]/70 text-sm md:text-base text-center">
          From spreadsheet to live application in minutes, not months.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-4">
          {howItWorks.slice(0, 4).map((step, index) => (
            <FeatureCard
              key={index}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

        {/* Fifth step centered */}
        <div className="w-full sm:w-[calc(50%-6px)] mx-auto">
          <FeatureCard
            title={howItWorks[4].title}
            description={howItWorks[4].description}
          />
        </div>
      </div>
    </section>
  );
}
