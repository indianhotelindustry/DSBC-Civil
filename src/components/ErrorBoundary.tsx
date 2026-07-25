import * as React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-[#e5e7eb] shadow-sm">
          <div className="p-4 bg-rose-50 rounded-full mb-6">
            <AlertTriangle className="h-12 w-12 text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Something went wrong</h2>
          <p className="text-[#6b7280] max-w-md mb-8">
            An unexpected error occurred while rendering this page. 
            {this.state.error?.message && (
              <span className="block mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-rose-500">
                {this.state.error.message}
              </span>
            )}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="gap-2 bg-[#2563eb] hover:bg-[#1d4ed8]"
          >
            <RefreshCcw className="h-4 w-4" />
            Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
