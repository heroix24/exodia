import { FeatureCard } from "./feature-card";

const howItWorks = [
  {
    title: "Upload Your Excel",
    description: "Simply drag and drop your spreadsheet file to get started",
  },
  {
    title: "AI Analyzes Structure",
    description: "Our AI understands your data, formulas, and relationships",
  },
  {
    title: "Generate Components",
    description: "Automatically create forms, tables, and dashboards",
  },
  {
    title: "Deploy Instantly",
    description: "Your web app is live and ready to share with your team",
  },
  {
    title: "Iterate & Improve",
    description: "Make changes and see updates in real-time",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-4 md:mx-auto max-w-[1000px] overflow-hidden px-4 md:px-5 py-6 md:py-8">
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
        <div className="w-full sm:w-[437px]">
          <FeatureCard
            title={howItWorks[4].title}
            description={howItWorks[4].description}
          />
        </div>
      </div>
    </section>
  );
}
