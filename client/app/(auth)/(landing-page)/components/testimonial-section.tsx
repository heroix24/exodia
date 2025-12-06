interface TestimonialSectionProps {
  quote: string;
  author: string;
  role: string;
}

export function TestimonialSection({
  quote,
  author,
  role,
}: TestimonialSectionProps) {
  return (
    <section className="mx-4 md:mx-auto max-w-[1000px] overflow-hidden px-4 md:px-14 py-8 md:py-12">
      <blockquote
        className="text-lg md:text-2xl font-bold italic leading-relaxed"
        style={{ fontFamily: "'Edu TAS Beginner', cursive" }}
      >
        &quot;{quote}&quot;
      </blockquote>
      <div className="mt-6 md:mt-8">
        <p className="font-semibold text-[#0d7239]">{author}</p>
        <p className="text-sm text-[#424242]/60">{role}</p>
      </div>
    </section>
  );
}
