'use client'

import { WifiOff, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface NetworkErrorFallbackProps {
  onRetry?: () => void
  message?: string
}

export default function NetworkErrorFallback({ 
  onRetry, 
  message = 'Unable to connect to the server. Please check your internet connection.' 
}: NetworkErrorFallbackProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      if (onRetry) {
        await onRetry()
      } else {
        // Default retry behavior - reload the page
        window.location.reload()
      }
    } catch (error) {
      console.error('Retry failed:', error)
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-8 h-8 text-orange-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Connection Error
        </h1>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
        >
          {isRetrying ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Try Again
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Component for handling API errors with retry functionality
export function ApiErrorFallback({ 
  error, 
  onRetry,
  action = 'fetch data' 
}: { 
  error: Error; 
  onRetry?: () => void; 
  action?: string;
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <WifiOff className="w-6 h-6 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-red-900 mb-2">
        Failed to {action}
      </h3>
      
      <p className="text-red-700 mb-4">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  )
}