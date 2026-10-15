'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect langsung ke halaman login
    router.push('/login');
  }, [router]);

  return null;
}

