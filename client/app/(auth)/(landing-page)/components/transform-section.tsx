import { Safari } from "@/components/ui/safari";

export function TransformSection() {
  return (
    <section className="mx-4 md:mx-auto max-w-[1000px] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="px-4 md:px-14 py-8 md:py-12">
          <h2
            className="text-2xl md:text-3xl font-bold leading-tight mb-6 md:mb-8"
            style={{ fontFamily: "'Edu TAS Beginner', cursive" }}
          >
            Transform Your Excel into{" "}
            <span className="text-[#0d7239]">Demand Generation</span>
          </h2>
          <div className="flex flex-col gap-4 md:gap-5 text-[#0d7239]">
            <p className="flex items-start gap-2 text-sm md:text-base">
              <span className="font-medium">→</span>
              Customizable and User-Friendly
            </p>
            <p className="flex items-start gap-2 text-sm md:text-base">
              <span className="font-medium">→</span>
              Build for Enterprises, Not Builders
            </p>
            <p className="flex items-start gap-2 text-sm md:text-base">
              <span className="font-medium">→</span>
              Rapid Excel-based Tooling
            </p>
          </div>
        </div>
        <div className="px-4 md:px-14 py-8 md:py-12 flex flex-col justify-center gap-6">
          <p
            className="text-[#424242]/80 text-sm md:text-base leading-relaxed"
            style={{ fontFamily: "'Edu TAS Beginner', cursive" }}
          >
            &quot;Non-technical users can turn spreadsheets into usable, scalable
            web applications, and customer-facing products. This lets them move
            faster, cut costs, and own their product workflows.&quot;
          </p>
          <div className="relative w-full max-w-[320px] mx-auto">
            <Safari
              url="exodia.app"
              className="w-full shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
