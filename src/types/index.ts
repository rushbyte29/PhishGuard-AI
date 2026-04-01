export interface EmailData {
  id: string;
  timestamp: Date;
  sender: string;
  subject: string;
  urls: string[];
  hasAttachment: boolean;
  timeOfDay: number;
}

export interface ProcessedEmail extends EmailData {
  riskScore: number;
  classification: 'Safe' | 'Phishing';
  reasons: string[];
}

export interface SenderStats {
  sender: string;
  emailCount: number;
  timestamps: Date[];
  avgHourOfDay: number;
  suspiciousPatterns: string[];
}

export interface TimeSeriesData {
  timestamp: Date;
  emailCount: number;
  phishingCount: number;
  safeCount: number;
}

export interface AnalysisResult {
  processedEmails: ProcessedEmail[];
  timeSeriesData: TimeSeriesData[];
  senderStats: SenderStats[];
  totalPhishing: number;
  totalSafe: number;
  avgRiskScore: number;
}
