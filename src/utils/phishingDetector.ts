import type { EmailData, ProcessedEmail, SenderStats, TimeSeriesData, AnalysisResult } from '../types';
import { differenceInHours, startOfHour, format } from 'date-fns';

const SUSPICIOUS_KEYWORDS = [
  'urgent', 'verify', 'suspend', 'confirm', 'prize', 'winner',
  'click here', 'act now', 'limited time', 'account locked', 'update payment'
];

const SUSPICIOUS_DOMAINS = [
  'urgentpay', 'secureverify', 'account-update', 'prize-winner',
  'verify', 'secure-login', 'update-account'
];

export function analyzeEmails(emails: EmailData[]): AnalysisResult {
  const senderMap = new Map<string, EmailData[]>();

  emails.forEach(email => {
    if (!senderMap.has(email.sender)) {
      senderMap.set(email.sender, []);
    }
    senderMap.get(email.sender)!.push(email);
  });

  const senderStats: SenderStats[] = Array.from(senderMap.entries()).map(([sender, senderEmails]) => {
    const timestamps = senderEmails.map(e => e.timestamp);
    const avgHour = timestamps.reduce((sum, ts) => sum + ts.getHours(), 0) / timestamps.length;

    const suspiciousPatterns: string[] = [];

    if (senderEmails.length > 5) {
      const timeSpan = differenceInHours(timestamps[timestamps.length - 1], timestamps[0]);
      if (timeSpan < 24) {
        suspiciousPatterns.push('Burst activity detected');
      }
    }

    if (avgHour < 6 || avgHour > 22) {
      suspiciousPatterns.push('Unusual time activity');
    }

    return {
      sender,
      emailCount: senderEmails.length,
      timestamps,
      avgHourOfDay: avgHour,
      suspiciousPatterns
    };
  });

  const processedEmails: ProcessedEmail[] = emails.map(email => {
    let riskScore = 0;
    const reasons: string[] = [];

    const subjectLower = email.subject.toLowerCase();
    const suspiciousKeywordCount = SUSPICIOUS_KEYWORDS.filter(kw => subjectLower.includes(kw)).length;
    if (suspiciousKeywordCount > 0) {
      riskScore += suspiciousKeywordCount * 15;
      reasons.push(`Suspicious keywords detected (${suspiciousKeywordCount})`);
    }

    const hasSuspiciousDomain = SUSPICIOUS_DOMAINS.some(domain =>
      email.sender.toLowerCase().includes(domain)
    );
    if (hasSuspiciousDomain) {
      riskScore += 25;
      reasons.push('Suspicious sender domain');
    }

    if (email.urls.length > 2) {
      riskScore += email.urls.length * 8;
      reasons.push(`Multiple URLs detected (${email.urls.length})`);
    }

    const hasHttpUrl = email.urls.some(url => url.startsWith('http://'));
    if (hasHttpUrl) {
      riskScore += 20;
      reasons.push('Insecure HTTP links detected');
    }

    const hour = email.timeOfDay;
    if (hour < 5 || hour > 23) {
      riskScore += 15;
      reasons.push('Email sent at unusual hours');
    }

    const stats = senderStats.find(s => s.sender === email.sender);
    if (stats && stats.emailCount > 5) {
      const recentEmails = stats.timestamps.filter(ts =>
        differenceInHours(email.timestamp, ts) <= 24
      ).length;

      if (recentEmails >= 5) {
        riskScore += 20;
        reasons.push('High frequency from sender');
      }
    }

    if (stats && stats.suspiciousPatterns.length > 0) {
      riskScore += 10 * stats.suspiciousPatterns.length;
      reasons.push(...stats.suspiciousPatterns);
    }

    riskScore = Math.min(100, riskScore);

    return {
      ...email,
      riskScore,
      classification: riskScore >= 50 ? 'Phishing' : 'Safe',
      reasons: reasons.length > 0 ? reasons : ['No suspicious patterns detected']
    };
  });

  const hourlyMap = new Map<string, { total: number; phishing: number; safe: number }>();

  processedEmails.forEach(email => {
    const hourKey = format(startOfHour(email.timestamp), 'yyyy-MM-dd HH:00');

    if (!hourlyMap.has(hourKey)) {
      hourlyMap.set(hourKey, { total: 0, phishing: 0, safe: 0 });
    }

    const stats = hourlyMap.get(hourKey)!;
    stats.total++;

    if (email.classification === 'Phishing') {
      stats.phishing++;
    } else {
      stats.safe++;
    }
  });

  const timeSeriesData: TimeSeriesData[] = Array.from(hourlyMap.entries())
    .map(([timestamp, stats]) => ({
      timestamp: new Date(timestamp),
      emailCount: stats.total,
      phishingCount: stats.phishing,
      safeCount: stats.safe
    }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const totalPhishing = processedEmails.filter(e => e.classification === 'Phishing').length;
  const totalSafe = processedEmails.filter(e => e.classification === 'Safe').length;
  const avgRiskScore = processedEmails.reduce((sum, e) => sum + e.riskScore, 0) / processedEmails.length;

  return {
    processedEmails,
    timeSeriesData,
    senderStats,
    totalPhishing,
    totalSafe,
    avgRiskScore
  };
}
