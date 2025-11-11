import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      retryCount: 0,
      isRetrying: false
    };
    this.maxRetries = 3;
    this.retryTimeouts = [];
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Attempt automatic retry if under max retry limit
    if (this.state.retryCount < this.maxRetries) {
      this.scheduleRetry();
    }
  }

  componentWillUnmount() {
    // Clear any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  scheduleRetry = () => {
    const retryDelay = Math.min(1000 * Math.pow(2, this.state.retryCount), 10000); // Exponential backoff, max 10s
    
    this.setState({ isRetrying: true });
    
    const timeout = setTimeout(() => {
      console.log(`Attempting recovery (retry ${this.state.retryCount + 1}/${this.maxRetries})`);
      this.setState(prevState => ({
        hasError: false,
        error: null,
        retryCount: prevState.retryCount + 1,
        isRetrying: false
      }));
    }, retryDelay);
    
    this.retryTimeouts.push(timeout);
  }

  handleManualRetry = () => {
    console.log('Manual retry triggered');
    this.setState({
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false
    });
  }

  handleReload = () => {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      const canRetry = this.state.retryCount < this.maxRetries;
      
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
              
              {this.state.isRetrying && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Attempting automatic recovery... (attempt {this.state.retryCount + 1}/{this.maxRetries})</span>
                </div>
              )}
              
              {!this.state.isRetrying && (
                <div className="flex gap-2">
                  {canRetry && (
                    <button
                      onClick={this.handleManualRetry}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Try Again
                    </button>
                  )}
                  <button
                    onClick={this.handleReload}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
              )}
              
              {!canRetry && !this.state.isRetrying && (
                <p className="text-sm text-muted-foreground">
                  Maximum retry attempts reached. Please reload the page.
                </p>
              )}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
