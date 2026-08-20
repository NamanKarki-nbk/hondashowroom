import { Metadata } from 'next';
import Link from 'next/link';
import { getLetters } from '@/app/actions/letter';
import { format } from 'date-fns';
import { FileText, Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Official Letters | Admin Dashboard',
};

export default async function LettersPage() {
  const letters = await getLetters();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#B83227]" />
            Official Letters
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage, generate, and track official letters and claims.
          </p>
        </div>
        
        <Link 
          href="/admin/letters/new"
          className="bg-[#B83227] hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Generate New Letter
        </Link>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium">
              <tr>
                <th className="px-4 py-3">Letter No.</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {letters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No letters generated yet.
                  </td>
                </tr>
              ) : (
                letters.map((letter) => (
                  <tr key={letter.id} className="border-b border-gray-200 dark:border-white/10 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {letter.letterNo}
                    </td>
                    <td className="px-4 py-3">
                      {format(new Date(letter.date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-full">
                        {letter.docType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {letter.recipient}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link 
                        href={`/admin/letters/${encodeURIComponent(letter.letterNo)}`}
                        className="text-[#B83227] hover:underline"
                      >
                        View & Print
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
