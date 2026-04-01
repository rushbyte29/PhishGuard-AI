# PhishGuard AI - Email Phishing Detection using Time Series Analysis

A fully frontend-based web application that uses time series analysis to detect phishing attempts in email datasets. Built with React, TypeScript, and Chart.js.

## Features

### Core Functionality
- **CSV Upload**: Import custom email datasets in CSV format
- **Mock Data Generator**: Use pre-generated sample datasets with 150+ emails
- **Time Series Analysis**: Analyze email patterns over time to detect anomalies
- **AI-Based Detection**: Rule-based scoring system that evaluates multiple risk factors
- **Interactive Visualizations**: Dynamic charts showing email frequency, risk trends, and sender behavior
- **Live Simulation Mode**: Real-time streaming of email analysis with dynamic updates
- **Advanced Filtering**: Filter emails by sender, classification, risk score, and time range

### Detection Criteria
The system analyzes emails based on:
- **Suspicious Keywords**: Detects urgent language, verification requests, account warnings
- **Sender Domain Analysis**: Identifies suspicious domain patterns
- **URL Analysis**: Flags multiple URLs, insecure HTTP links
- **Time-Based Patterns**: Detects unusual sending times (late night/early morning)
- **Sender Frequency**: Identifies burst activity and high-frequency patterns
- **Email Clustering**: Detects sudden spikes from the same sender

### UI/UX Features
- **Cybersecurity Dark Theme**: Professional dark mode design optimized for security operations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Navigation**: Four main sections (Home, Upload, Dashboard, Analysis)
- **Real-Time Updates**: Dynamic charts and statistics that update as data is processed
- **Detailed Reports**: View individual email risk assessments with explanations

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Chart.js** - Interactive data visualization
- **React-ChartJS-2** - React wrapper for Chart.js
- **Papa Parse** - CSV parsing
- **date-fns** - Date/time manipulation

## Installation & SetUp

### 1. Clone the repository
```bash
git clone https://github.com/rushbyte29/PhishGuard-AI.git
cd PhishGuard-AI

# Install dependencies
npm install

# Build for production
npm run build
```

## Usage

### 1. Upload Dataset
Navigate to the "Upload Dataset" tab and either:
- Upload your own CSV file with email data
- Use the "Load Sample Data" button for a pre-generated dataset
- Download a sample CSV to see the expected format

### 2. View Dashboard
After loading data, the Dashboard displays:
- Overall statistics (total emails, phishing count, risk scores)
- Time series chart showing email activity over time
- Classification breakdown (Safe vs Phishing)
- Top senders with activity patterns

### 3. Detailed Analysis
The Analysis tab provides:
- Complete table of all analyzed emails
- Risk scores and classification for each email
- Filtering options by sender, classification, and risk level
- Detailed inspection of detection reasons for each email

### 4. Live Simulation
Click "Start Live Simulation" to:
- Watch emails being processed in real-time
- See risk scores update dynamically
- Monitor streaming feed of recent emails
- Adjust simulation speed (Slow, Normal, Fast, Very Fast)

## CSV Format

Your CSV file should include these columns:

```
id,timestamp,sender,subject,urls,hasAttachment,timeOfDay
EMAIL-0001,2024-01-01T10:30:00.000Z,user@company.com,"Meeting Update","https://company.com/calendar",false,10
EMAIL-0002,2024-01-01T02:15:00.000Z,noreply@urgentpay.com,"URGENT: Verify Your Account","http://urgentpay.com/verify1;http://urgentpay.com/verify2",false,2
```

### Column Descriptions:
- **id**: Unique email identifier
- **timestamp**: ISO 8601 date/time when email was received
- **sender**: Email address of the sender
- **subject**: Email subject line
- **urls**: URLs found in email (separated by semicolons)
- **hasAttachment**: Boolean indicating if email has attachments
- **timeOfDay**: Hour of day (0-23)

## Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main app layout with header/footer
│   ├── Navigation.tsx  # Tab navigation
│   ├── Home.tsx        # Landing page
│   ├── Upload.tsx      # File upload interface
│   ├── Dashboard.tsx   # Analytics dashboard
│   ├── Analysis.tsx    # Detailed analysis table
│   └── LiveSimulation.tsx  # Real-time simulation
├── utils/              # Utility functions
│   ├── csvParser.ts           # CSV file parsing
│   ├── mockDataGenerator.ts  # Sample data generation
│   └── phishingDetector.ts   # Detection algorithm
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
├── App.css            # Application styles
└── index.css          # Global styles
```

## Detection Algorithm

The phishing detection system uses multiple factors to calculate a risk score (0-100):

1. **Keyword Analysis** (+15 per keyword)
   - Urgent, verify, suspend, confirm, prize, winner, etc.

2. **Domain Analysis** (+25)
   - Suspicious domain patterns in sender address

3. **URL Analysis** (+8 per URL, +20 for HTTP)
   - Multiple URLs flag higher risk
   - Insecure HTTP links are penalized

4. **Time Analysis** (+15)
   - Emails sent between midnight and 5 AM
   - Late night activity (after 11 PM)

5. **Frequency Analysis** (+20)
   - Burst patterns (5+ emails in 24 hours)
   - Unusual sending patterns

6. **Pattern Aggregation** (+10 per pattern)
   - Combined suspicious behaviors

**Classification Threshold**: Risk score ≥ 50 = Phishing

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

