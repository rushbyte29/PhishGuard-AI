import type { EmailData } from '../types';

const suspiciousDomains = ['urgentpay.com', 'secureverify.net', 'account-update.org', 'prize-winner.info'];
const legitimateDomains = ['company.com', 'university.edu', 'newsletter.org', 'service.io'];
const suspiciousKeywords = ['urgent', 'verify', 'suspend', 'confirm', 'prize', 'winner', 'click here', 'act now'];
const normalKeywords = ['meeting', 'report', 'update', 'newsletter', 'invoice', 'schedule'];

export function generateMockDataset(count: number = 100): EmailData[] {
  const emails: EmailData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  for (let i = 0; i < count; i++) {
    const isPhishing = Math.random() < 0.3;
    const timestamp = new Date(startDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);

    let timeOfDay = Math.floor(Math.random() * 24);
    if (isPhishing && Math.random() < 0.4) {
      timeOfDay = Math.random() < 0.5 ? Math.floor(Math.random() * 5) : Math.floor(20 + Math.random() * 4);
    }

    timestamp.setHours(timeOfDay, Math.floor(Math.random() * 60), 0, 0);

    const domain = isPhishing
      ? suspiciousDomains[Math.floor(Math.random() * suspiciousDomains.length)]
      : legitimateDomains[Math.floor(Math.random() * legitimateDomains.length)];

    const sender = isPhishing && Math.random() < 0.6
      ? `noreply@${domain}`
      : `user${Math.floor(Math.random() * 50)}@${domain}`;

    const keywords = isPhishing ? suspiciousKeywords : normalKeywords;
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const subject = isPhishing
      ? `${keyword.toUpperCase()}: ${['Action Required', 'Your Account', 'Important Notice'][Math.floor(Math.random() * 3)]}`
      : `${keyword}: ${['Weekly Update', 'Team Meeting', 'Monthly Report'][Math.floor(Math.random() * 3)]}`;

    const urlCount = isPhishing ? Math.floor(Math.random() * 5) + 1 : Math.random() < 0.3 ? 1 : 0;
    const urls: string[] = [];
    for (let j = 0; j < urlCount; j++) {
      urls.push(isPhishing ? `http://${domain}/verify${j}` : `https://${domain}/page${j}`);
    }

    emails.push({
      id: `EMAIL-${String(i + 1).padStart(4, '0')}`,
      timestamp,
      sender,
      subject,
      urls,
      hasAttachment: Math.random() < 0.2,
      timeOfDay
    });
  }

  return emails.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

export function generateCSVContent(emails: EmailData[]): string {
  const headers = 'id,timestamp,sender,subject,urls,hasAttachment,timeOfDay\n';
  const rows = emails.map(email => {
    return `${email.id},${email.timestamp.toISOString()},${email.sender},"${email.subject}","${email.urls.join(';')}",${email.hasAttachment},${email.timeOfDay}`;
  }).join('\n');

  return headers + rows;
}
