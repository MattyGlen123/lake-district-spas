import { ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';
import { Spa } from '@/types/spa';

interface BookVisitCTAProps {
  spa: Spa;
}

export default function BookVisitCTA({ spa }: BookVisitCTAProps) {
  return (
    <div className="container mx-auto px-4 md:px-8 mb-16">
      <section
        id="book"
        className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Book Your {spa.name} Experience
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Ready to experience the {spa.name}? As a curated directory, we
            connect you directly with the hotel for official pricing and
            real-time availability. We recommend booking in advance, especially
            during peak seasons.
          </p>
          <a
            href={spa.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-900/40 group"
          >
            Visit {spa.name} Official Website
            <ExternalLink className="h-5 w-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
          <div className="mt-8 pt-8 border-t text-left md:text-center border-slate-800 flex items-center justify-center space-x-6 text-sm text-slate-400">
            <span className="flex items-center">
              <ShieldCheck className="h-4 w-4 mr-1.5" />
              Sourced from Official Website
            </span>
            <span className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Regularly Updated
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
