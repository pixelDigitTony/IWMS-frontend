import { Suspense } from 'react';
import { Router } from '@/app/routes';

export function App() {
  return (
    <div className="min-h-full bg-gray-50 text-gray-900">
      <Suspense fallback={<div className="p-6">Loading…</div>}>
        <Router />
      </Suspense>
    </div>
  );
}


