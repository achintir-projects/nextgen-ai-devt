/**
 * Custom 404 Page for Pages Router
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/studio">
              Go to Studio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}