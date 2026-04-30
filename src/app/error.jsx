'use client';

/**
 * Global Error Boundary
 * 
 * Catches any unhandled errors in the app and shows a friendly fallback
 * instead of a raw 500 error page. This is the last line of defense for
 * transient issues like MongoDB connection timeouts.
 */
export default function GlobalError({ error, reset }) {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-red-600">Something went wrong</h1>
        <p className="text-gray-600 mt-4 text-lg">
          We're experiencing a temporary issue. Please try again in a moment.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium transition cursor-pointer"
          >
            Try Again
          </button>
          <a
            href="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md text-lg font-medium transition"
          >
            Back to Homepage
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left max-w-2xl mx-auto">
            <summary className="cursor-pointer text-sm text-gray-500">Error Details (dev only)</summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
              {error?.message}
              {'\n'}
              {error?.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
