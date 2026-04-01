import { useState, useRef } from 'react';
import type { EmailData } from '../types';
import { parseCSV } from '../utils/csvParser';
import { generateMockDataset, generateCSVContent } from '../utils/mockDataGenerator';

interface UploadProps {
  onDataLoaded: (emails: EmailData[]) => void;
}

export default function Upload({ onDataLoaded }: UploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const emails = await parseCSV(file);

      if (emails.length === 0) {
        throw new Error('No valid email records found in the CSV file');
      }

      onDataLoaded(emails);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSampleData = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const mockEmails = generateMockDataset(150);
      onDataLoaded(mockEmails);
      setIsLoading(false);
    }, 500);
  };

  const handleDownloadSample = () => {
    const mockEmails = generateMockDataset(50);
    const csvContent = generateCSVContent(mockEmails);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_email_dataset.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h2>Upload Email Dataset</h2>
        <p>Import your CSV file containing email data for phishing detection analysis</p>
      </div>

      <div className="upload-content">
        <div className="upload-box">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <div className="upload-icon">📁</div>
          <h3>Drop your CSV file here</h3>
          <p>or</p>

          <button
            className="btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Choose File'}
          </button>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="sample-data-section">
          <h3>Use Sample Dataset</h3>
          <p>Don't have a dataset? Use our pre-generated sample data with 150 email records</p>

          <button
            className="btn-secondary"
            onClick={handleUseSampleData}
            disabled={isLoading}
          >
            Load Sample Data
          </button>

          <button
            className="btn-text"
            onClick={handleDownloadSample}
          >
            Download Sample CSV
          </button>
        </div>
      </div>

      <div className="dataset-format">
        <h3>Expected CSV Format</h3>
        <div className="format-description">
          <p>Your CSV file should contain the following columns:</p>
          <ul>
            <li><code>id</code> - Unique email identifier</li>
            <li><code>timestamp</code> - ISO date/time when email was received</li>
            <li><code>sender</code> - Email address of the sender</li>
            <li><code>subject</code> - Email subject line</li>
            <li><code>urls</code> - URLs in email (separated by semicolons)</li>
            <li><code>hasAttachment</code> - Boolean indicating attachment presence</li>
            <li><code>timeOfDay</code> - Hour of day (0-23)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
