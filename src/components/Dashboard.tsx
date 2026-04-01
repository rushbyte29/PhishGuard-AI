import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { format } from 'date-fns';
import type { AnalysisResult } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardProps {
  analysis: AnalysisResult;
}

export default function Dashboard({ analysis }: DashboardProps) {
  const timeSeriesChartData = {
    labels: analysis.timeSeriesData.map(d => format(d.timestamp, 'MMM dd HH:mm')),
    datasets: [
      {
        label: 'Phishing Emails',
        data: analysis.timeSeriesData.map(d => d.phishingCount),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Safe Emails',
        data: analysis.timeSeriesData.map(d => d.safeCount),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const timeSeriesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#e5e7eb' }
      },
      title: {
        display: true,
        text: 'Email Activity Over Time',
        color: '#f9fafb',
        font: { size: 16 }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af', maxRotation: 45, minRotation: 45 },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  const classificationData = {
    labels: ['Safe', 'Phishing'],
    datasets: [{
      data: [analysis.totalSafe, analysis.totalPhishing],
      backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
      borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
      borderWidth: 2
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#e5e7eb', padding: 15 }
      },
      title: {
        display: true,
        text: 'Email Classification',
        color: '#f9fafb',
        font: { size: 16 }
      }
    }
  };

  const topSenders = [...analysis.senderStats]
    .sort((a, b) => b.emailCount - a.emailCount)
    .slice(0, 10);

  const senderChartData = {
    labels: topSenders.map(s => s.sender.split('@')[0]),
    datasets: [{
      label: 'Email Count',
      data: topSenders.map(s => s.emailCount),
      backgroundColor: topSenders.map(s =>
        s.suspiciousPatterns.length > 0 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(59, 130, 246, 0.8)'
      ),
      borderColor: topSenders.map(s =>
        s.suspiciousPatterns.length > 0 ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'
      ),
      borderWidth: 1
    }]
  };

  const senderOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Top Email Senders',
        color: '#f9fafb',
        font: { size: 16 }
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Analysis Dashboard</h2>
        <p>Comprehensive overview of email threat detection results</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon safe">✓</div>
          <div className="stat-content">
            <div className="stat-value">{analysis.totalSafe}</div>
            <div className="stat-label">Safe Emails</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon danger">⚠</div>
          <div className="stat-content">
            <div className="stat-value">{analysis.totalPhishing}</div>
            <div className="stat-label">Phishing Detected</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">📊</div>
          <div className="stat-content">
            <div className="stat-value">{analysis.processedEmails.length}</div>
            <div className="stat-label">Total Emails</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">📈</div>
          <div className="stat-content">
            <div className="stat-value">{analysis.avgRiskScore.toFixed(1)}</div>
            <div className="stat-label">Avg Risk Score</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card large">
          <Line data={timeSeriesChartData} options={timeSeriesOptions} />
        </div>

        <div className="chart-card">
          <Doughnut data={classificationData} options={doughnutOptions} />
        </div>

        <div className="chart-card">
          <Bar data={senderChartData} options={senderOptions} />
        </div>
      </div>

      <div className="insights-section">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Detection Rate</h4>
            <p>
              {((analysis.totalPhishing / analysis.processedEmails.length) * 100).toFixed(1)}%
              of emails flagged as phishing attempts
            </p>
          </div>
          <div className="insight-card">
            <h4>Peak Activity</h4>
            <p>
              {analysis.timeSeriesData.reduce((max, curr) =>
                curr.emailCount > max.emailCount ? curr : max
              ).emailCount} emails at peak hour
            </p>
          </div>
          <div className="insight-card">
            <h4>Suspicious Senders</h4>
            <p>
              {analysis.senderStats.filter(s => s.suspiciousPatterns.length > 0).length}
              senders with unusual patterns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
