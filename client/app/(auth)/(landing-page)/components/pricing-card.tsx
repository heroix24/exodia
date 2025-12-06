import { Flower } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-lg ${
        highlighted
          ? "border-2 border-[#0d7239] order-first lg:order-none"
          : "border border-[#c8c8c8]"
      } bg-[#fff6ed] px-4 md:px-5 py-6 md:py-8 w-full max-w-[320px] lg:w-[274px]`}
    >
      {highlighted && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <div className="bg-[#0d7239] rounded-full px-4 md:px-8 py-2 flex items-center gap-2 whitespace-nowrap">
            <Flower className="w-5 h-5 md:w-6 md:h-6 text-[#fff6ed]" />
            <span className="text-sm md:text-base font-semibold text-[#fff6ed]">
              Most Popular
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4 md:gap-5">
        <p className="text-base font-medium text-[#0d7239]">{name}</p>
        <div className="flex items-center gap-2">
          <span
            className="text-[28px] md:text-[32px] font-bold text-[#0d7239]"
            style={{ fontFamily: "'Edu TAS Beginner', cursive" }}
          >
            {price}
          </span>
          <span className="text-sm md:text-base font-medium text-[#0d7239]">
            {period}
          </span>
        </div>
        <p className="text-sm md:text-base font-medium text-[#0d7239]/70">
          {description}
        </p>
        <div className="flex flex-col gap-3 md:gap-5">
          {features.map((feature, featureIndex) => (
            <p
              key={featureIndex}
              className="text-sm font-medium text-[#0d7239]"
            >
              {feature}
            </p>
          ))}
        </div>
      </div>
      <Button
        className={`w-full py-4 rounded-lg font-semibold text-sm md:text-base mt-6 ${
          highlighted
            ? "bg-[#0d7239] text-[#fff6ed] hover:bg-[#0a5c2d]"
            : "bg-[#f2f2f2] text-[#0d7239] hover:bg-[#e5e5e5]"
        }`}
      >
        {cta}
      </Button>
    </div>
  );
}

