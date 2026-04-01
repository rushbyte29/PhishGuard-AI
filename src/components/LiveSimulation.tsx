import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import type { EmailData, ProcessedEmail } from '../types';
import { analyzeEmails } from '../utils/phishingDetector';

interface LiveSimulationProps {
  baseEmails: EmailData[];
  onStop: () => void;
}

export default function LiveSimulation({ baseEmails, onStop }: LiveSimulationProps) {
  const [streamedEmails, setStreamedEmails] = useState<ProcessedEmail[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    if (currentIndex >= baseEmails.length) {
      return;
    }

    const timer = setTimeout(() => {
      const emailsToAnalyze = baseEmails.slice(0, currentIndex + 1);
      const analysis = analyzeEmails(emailsToAnalyze);
      setStreamedEmails(analysis.processedEmails);
      setCurrentIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, baseEmails, speed]);

  const recentEmails = streamedEmails.slice(-10).reverse();

  const chartData = {
    labels: streamedEmails.slice(-20).map((_, idx) => `T-${20 - idx}`),
    datasets: [
      {
        label: 'Risk Score',
        data: streamedEmails.slice(-20).map(e => e.riskScore),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300
    },
    plugins: {
      legend: {
        labels: { color: '#e5e7eb' }
      },
      title: {
        display: true,
        text: 'Real-Time Risk Score Stream',
        color: '#f9fafb'
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        min: 0,
        max: 100,
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  const phishingCount = streamedEmails.filter(e => e.classification === 'Phishing').length;
  const safeCount = streamedEmails.filter(e => e.classification === 'Safe').length;

  return (
    <div className="simulation-overlay">
      <div className="simulation-container">
        <div className="simulation-header">
          <div>
            <h2>🔴 Live Simulation Mode</h2>
            <p>Monitoring incoming emails in real-time</p>
          </div>
          <button className="btn-stop" onClick={onStop}>
            Stop Simulation
          </button>
        </div>

        <div className="simulation-controls">
          <label>
            Speed:
            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
              <option value={2000}>Slow (2s)</option>
              <option value={1000}>Normal (1s)</option>
              <option value={500}>Fast (0.5s)</option>
              <option value={200}>Very Fast (0.2s)</option>
            </select>
          </label>
          <div className="simulation-progress">
            Progress: {currentIndex} / {baseEmails.length} emails
          </div>
        </div>

        <div className="simulation-stats">
          <div className="sim-stat safe">
            <div className="sim-stat-value">{safeCount}</div>
            <div className="sim-stat-label">Safe</div>
          </div>
          <div className="sim-stat phishing">
            <div className="sim-stat-value">{phishingCount}</div>
            <div className="sim-stat-label">Phishing</div>
          </div>
          <div className="sim-stat total">
            <div className="sim-stat-value">{streamedEmails.length}</div>
            <div className="sim-stat-label">Total</div>
          </div>
        </div>

        <div className="simulation-chart">
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="simulation-feed">
          <h3>Recent Emails</h3>
          <div className="email-feed">
            {recentEmails.map(email => (
              <div
                key={email.id}
                className={`feed-item ${email.classification === 'Phishing' ? 'feed-phishing' : 'feed-safe'}`}
              >
                <div className="feed-header">
                  <span className="feed-id">{email.id}</span>
                  <span className="feed-time">{format(email.timestamp, 'HH:mm:ss')}</span>
                  <span className={`feed-badge ${email.classification.toLowerCase()}`}>
                    {email.classification}
                  </span>
                </div>
                <div className="feed-content">
                  <div className="feed-sender">{email.sender}</div>
                  <div className="feed-subject">{email.subject}</div>
                  <div className="feed-risk">Risk: {email.riskScore}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
