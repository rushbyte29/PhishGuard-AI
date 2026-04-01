import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 8v12c0 7.5 5.2 14.5 12 16 6.8-1.5 12-8.5 12-16V8L16 2z" fill="currentColor" opacity="0.2"/>
              <path d="M16 2L4 8v12c0 7.5 5.2 14.5 12 16 6.8-1.5 12-8.5 12-16V8L16 2z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h1>PhishGuard AI</h1>
          </div>
          <p className="tagline">AI-Based Email Phishing Detection</p>
        </div>
      </header>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <p>Powered by Time Series Analysis • Developed for Cybersecurity Research</p>
      </footer>
    </div>
  );
}
