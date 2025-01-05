export interface EmailData {
  id: string;
  threadId: string;
  subject: string;
  snippet: string;
  sender: string;
  date: string;
  labels: string[];
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  attachments?: {
    name: string;
    url: string;
  }[];
}
