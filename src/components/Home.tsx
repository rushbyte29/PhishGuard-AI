interface HomeProps {
  onGetStarted: () => void;
}

export default function Home({ onGetStarted }: HomeProps) {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h2>Advanced Email Threat Detection</h2>
        <p className="subtitle">
          Leverage cutting-edge time series analysis to identify phishing attempts and protect your organization
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Time Series Analysis</h3>
            <p>Detect anomalous patterns in email frequency, sender behavior, and timing</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Smart Detection</h3>
            <p>AI-powered analysis of keywords, URLs, and suspicious patterns</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Visual Analytics</h3>
            <p>Interactive charts and graphs to understand threat landscape</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Live Simulation</h3>
            <p>Real-time monitoring with streaming email analysis</p>
          </div>
        </div>

        <div className="cta-section">
          <button className="btn-primary" onClick={onGetStarted}>
            Get Started
          </button>
          <p className="help-text">Upload your dataset or use our sample data to begin analysis</p>
        </div>
      </div>

      <div className="info-section">
        <h3>How It Works</h3>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Upload Data</h4>
              <p>Import your email dataset in CSV format or use our generated sample</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Analyze Patterns</h4>
              <p>Our AI engine examines time series data to identify suspicious behavior</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Review Results</h4>
              <p>Explore detailed insights, risk scores, and visual analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
