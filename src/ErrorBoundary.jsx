import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.props.children !== prevProps.children && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#0B0F19',
          color: '#F8FAFC',
          padding: '2.5rem',
          borderRadius: '12px',
          border: '1px solid #EF4444',
          margin: '1.5rem',
          fontFamily: 'sans-serif'
        }}>
          <h2 style={{ color: '#EF4444', marginTop: 0 }}>Portal Component Recovered</h2>
          <p style={{ color: '#CBD5E1' }}>
            A temporary component rendering event occurred.
          </p>
          <pre style={{
            background: '#040710',
            padding: '1rem',
            borderRadius: '8px',
            color: '#FCA5A5',
            fontSize: '0.82rem',
            overflowX: 'auto'
          }}>
            {this.state.error ? this.state.error.toString() : 'Unknown Error'}
          </pre>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
            }}
            style={{
              background: '#00E5FF',
              color: '#060913',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontWeight: 800,
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Reset Workspace State & Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
