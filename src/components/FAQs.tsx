import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface FAQ {
  question: string;
  answer: string | ReactNode;
  schemaText?: string; // Plain text version for Schema.org markup
}

interface FAQsProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  faqs: FAQ[];
  className?: string;
  id?: string;
}

export default function FAQs({
  title,
  subtitle,
  icon: Icon,
  faqs,
  className = '',
  id,
}: FAQsProps) {
  return (
    <section id={id} className={`py-24 max-w-4xl mx-auto ${className}`}>
      <div className="text-center mb-20">
        {Icon && (
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-700 border border-amber-100">
              <Icon className="h-6 w-6" strokeWidth={1.5} />
            </div>
          </div>
        )}
        <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-stone-500 font-light italic text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-24">
        {faqs.map((faq, index) => (
          <div key={index} id={index === 3 ? 'faq-4' : undefined} className="space-y-4">
            <h3 className="font-serif text-2xl md:text-3xl text-stone-800 leading-tight">
              {faq.question}
            </h3>
            <div className="text-stone-500 text-lg leading-relaxed font-light italic">
              {typeof faq.answer === 'string' ? (
                <p>{faq.answer}</p>
              ) : (
                faq.answer
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Generates FAQPage Schema.org JSON-LD markup for SEO
 */
export function generateFAQSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.schemaText || (typeof faq.answer === 'string' ? faq.answer : ''),
      },
    })),
  };
}

