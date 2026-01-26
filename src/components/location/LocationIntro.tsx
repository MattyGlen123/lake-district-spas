interface LocationIntroProps {
  content: string;
}

export default function LocationIntro({ content }: LocationIntroProps) {
  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <section className="bg-[#FAF9F6] py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="space-y-12">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-lg text-stone-600 leading-relaxed font-light ${
                index === 0
                  ? 'first-letter:text-7xl md:first-letter:text-8xl first-letter:font-serif first-letter:font-bold first-letter:text-emerald-950 first-letter:float-left first-letter:mr-6 first-letter:mt-4 first-letter:leading-[0.7]'
                  : ''
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

