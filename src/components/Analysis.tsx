import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import type { AnalysisResult } from '../types';

interface AnalysisProps {
  analysis: AnalysisResult;
  onStartSimulation: () => void;
  isSimulating: boolean;
}

export default function Analysis({ analysis, onStartSimulation, isSimulating }: AnalysisProps) {
  const [filterSender, setFilterSender] = useState('');
  const [filterClassification, setFilterClassification] = useState<'all' | 'Safe' | 'Phishing'>('all');
  const [filterRiskMin, setFilterRiskMin] = useState(0);
  const [sortBy, setSortBy] = useState<'timestamp' | 'risk'>('risk');

  const uniqueSenders = useMemo(() => {
    return Array.from(new Set(analysis.processedEmails.map(e => e.sender))).sort();
  }, [analysis.processedEmails]);

  const filteredEmails = useMemo(() => {
    let filtered = [...analysis.processedEmails];

    if (filterSender) {
      filtered = filtered.filter(e => e.sender === filterSender);
    }

    if (filterClassification !== 'all') {
      filtered = filtered.filter(e => e.classification === filterClassification);
    }

    filtered = filtered.filter(e => e.riskScore >= filterRiskMin);

    filtered.sort((a, b) => {
      if (sortBy === 'risk') {
        return b.riskScore - a.riskScore;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    return filtered;
  }, [analysis.processedEmails, filterSender, filterClassification, filterRiskMin, sortBy]);

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <div>
          <h2>Detailed Analysis</h2>
          <p>Examine individual email risk assessments and patterns</p>
        </div>
        <button
          className={`btn-simulation ${isSimulating ? 'active' : ''}`}
          onClick={onStartSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? '⏸ Simulation Running' : '▶ Start Live Simulation'}
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Sender</label>
          <select value={filterSender} onChange={(e) => setFilterSender(e.target.value)}>
            <option value="">All Senders</option>
            {uniqueSenders.map(sender => (
              <option key={sender} value={sender}>{sender}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Classification</label>
          <select
            value={filterClassification}
            onChange={(e) => setFilterClassification(e.target.value as 'all' | 'Safe' | 'Phishing')}
          >
            <option value="all">All</option>
            <option value="Safe">Safe</option>
            <option value="Phishing">Phishing</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Min Risk Score: {filterRiskMin}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={filterRiskMin}
            onChange={(e) => setFilterRiskMin(Number(e.target.value))}
          />
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'timestamp' | 'risk')}>
            <option value="risk">Risk Score</option>
            <option value="timestamp">Timestamp</option>
          </select>
        </div>

        <div className="filter-stats">
          Showing {filteredEmails.length} of {analysis.processedEmails.length} emails
        </div>
      </div>

      <div className="table-container">
        <table className="analysis-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Sender</th>
              <th>Subject</th>
              <th>Risk Score</th>
              <th>Classification</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmails.map(email => (
              <tr key={email.id} className={email.classification === 'Phishing' ? 'phishing-row' : 'safe-row'}>
                <td className="email-id">{email.id}</td>
                <td className="timestamp">{format(email.timestamp, 'MMM dd, yyyy HH:mm')}</td>
                <td className="sender">{email.sender}</td>
                <td className="subject">{email.subject}</td>
                <td className="risk-score">
                  <div className="risk-badge" style={{
                    backgroundColor: email.riskScore >= 75 ? '#dc2626' :
                                     email.riskScore >= 50 ? '#f59e0b' :
                                     email.riskScore >= 25 ? '#fbbf24' : '#22c55e'
                  }}>
                    {email.riskScore}
                  </div>
                </td>
                <td className="classification">
                  <span className={`classification-badge ${email.classification.toLowerCase()}`}>
                    {email.classification}
                  </span>
                </td>
                <td className="details">
                  <details>
                    <summary>View</summary>
                    <div className="details-content">
                      <strong>Detection Reasons:</strong>
                      <ul>
                        {email.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                      {email.urls.length > 0 && (
                        <>
                          <strong>URLs Found:</strong>
                          <ul>
                            {email.urls.map((url, idx) => (
                              <li key={idx}><code>{url}</code></li>
                            ))}
                          </ul>
                        </>
                      )}
                      <strong>Time of Day:</strong> {email.timeOfDay}:00
                      <br />
                      <strong>Has Attachment:</strong> {email.hasAttachment ? 'Yes' : 'No'}
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEmails.length === 0 && (
          <div className="no-results">
            No emails match the current filters
          </div>
        )}
      </div>
    </div>
  );
}
