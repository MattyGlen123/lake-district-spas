import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <div className="container mx-auto px-4 md:px-8 mb-8">
      <Link
        href="/spas"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Spas
      </Link>
    </div>
  );
}
