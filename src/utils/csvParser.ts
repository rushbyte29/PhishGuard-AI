import Papa from 'papaparse';
import type { EmailData } from '../types';

export function parseCSV(file: File): Promise<EmailData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const emails: EmailData[] = results.data.map((row: any, index: number) => {
            const urls = row.urls ? String(row.urls).split(';').filter(Boolean) : [];

            return {
              id: row.id || `EMAIL-${String(index + 1).padStart(4, '0')}`,
              timestamp: new Date(row.timestamp),
              sender: String(row.sender || ''),
              subject: String(row.subject || ''),
              urls,
              hasAttachment: String(row.hasAttachment).toLowerCase() === 'true',
              timeOfDay: parseInt(row.timeOfDay) || new Date(row.timestamp).getHours()
            };
          });

          resolve(emails);
        } catch (error) {
          reject(new Error('Failed to parse CSV: ' + (error as Error).message));
        }
      },
      error: (error) => {
        reject(new Error('CSV parsing error: ' + error.message));
      }
    });
  });
}
