import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-[#0B1220] flex items-center justify-center p-6">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Application Error</h2>
            <p className="text-[#9CA3AF] mb-4">An error occurred while rendering the application.</p>
            <details className="bg-[#1F2937] p-4 rounded-lg text-sm text-[#E5E7EB] whitespace-pre-wrap overflow-auto max-h-64">
              <summary className="cursor-pointer font-bold text-[#2563EB]">Error Details</summary>
              <pre className="mt-2">{this.state.error?.toString()}</pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
