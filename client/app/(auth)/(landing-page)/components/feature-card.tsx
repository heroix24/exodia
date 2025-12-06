interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="h-[160px] sm:h-[200px] md:h-[260px] w-full bg-[#0d7239] rounded-t-2xl" />
      <div className="px-5 md:px-6 py-5 md:py-7 bg-gradient-to-b from-[#a8c5a8] to-[#e8ede4] rounded-b-2xl min-h-[120px] md:min-h-[140px]">
        <h3 className="text-lg md:text-xl font-semibold text-[#424242] mb-2">
          {title}
        </h3>
        <p className="text-sm md:text-base font-medium text-[#424242]">
          {description}
        </p>
      </div>
    </div>
  );
}

