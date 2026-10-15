'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-6">
            Error: {error || 'Unknown error'}
          </p>
          <Link
            href="/login"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return <Suspense fallback={<div className="min-h-screen bg-gray-50" />}><AuthErrorContent /></Suspense>;
}
