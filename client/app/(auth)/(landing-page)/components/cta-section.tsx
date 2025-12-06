import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="mx-4 md:mx-auto max-w-[1000px] overflow-hidden">
      <div className="bg-[#0d7239] px-4 md:px-14 py-10 md:py-16 rounded-2xl mx-4 my-6 md:my-8">
        <div className="text-center">
          <h2
            className="text-2xl md:text-4xl font-bold mb-4 text-[#fff6ed]"
            style={{ fontFamily: "'Edu TAS Beginner', cursive" }}
          >
            Ready to Transform Your Excel?
          </h2>
          <p className="text-[#fff6ed]/80 text-sm md:text-base max-w-2xl mx-auto mb-6 md:mb-8">
            Join hundreds of businesses already building web apps from their
            spreadsheets. Limited early access spots available.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <Button className="w-full sm:w-auto bg-[#fff6ed] px-6 md:px-8 py-4 md:py-6 text-sm md:text-base font-semibold text-[#0d7239] hover:bg-[#fff6ed]/90 flex items-center justify-center gap-2">
              Claim Early Access
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border border-[#fff6ed] bg-transparent px-6 md:px-8 py-4 md:py-6 text-sm md:text-base font-semibold text-[#fff6ed] hover:bg-[#fff6ed]/10"
            >
              See Demo
            </Button>
          </div>
          <p className="mt-6 md:mt-8 text-sm md:text-base text-[#fff6ed]/70">
            No credit card required • Free tier available forever
          </p>
        </div>
      </div>
    </section>
  );
}
