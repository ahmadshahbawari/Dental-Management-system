import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-200"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-700">Loading Dental Lab System</h2>
          <p className="text-gray-500 text-sm">Please wait while we prepare your workspace...</p>
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-4 w-4 animate-spin" />
    </div>
  );
}
