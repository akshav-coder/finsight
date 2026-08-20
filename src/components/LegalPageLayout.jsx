import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function LegalPageLayout({ title, updatedDate, children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to FinSight
        </Link>

        <h1 className="text-4xl font-display font-black tracking-tight mb-2">{title}</h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">Last updated: {updatedDate}</p>

        <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed [&_h2]:text-2xl [&_h2]:font-display [&_h2]:font-black [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mb-3 [&_p]:mb-4 [&_li]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:text-primary-500 [&_a]:font-bold [&_a]:hover:underline [&_strong]:text-slate-800 [&_strong]:dark:text-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}
