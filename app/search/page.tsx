'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Результаты поиска</h1>
      <p>Поисковый запрос: {query}</p>
      {/* Здесь можно добавить результаты поиска */}
    </div>
  );
} 