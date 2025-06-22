
// Microsoft Graph API utilities for Outlook Calendar integration

interface OutlookEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  isOnlineMeeting: boolean;
  onlineMeeting?: {
    joinUrl: string;
  };
  categories: string[];
}

interface GraphResponse<T> {
  value: T[];
  '@odata.nextLink'?: string;
}

export class OutlookAPI {
  private baseUrl = 'https://graph.microsoft.com/v1.0';

  async getEvents(accessToken: string, startDate?: Date, endDate?: Date): Promise<OutlookEvent[]> {
    try {
      let url = `${this.baseUrl}/me/events`;
      
      // Add date filtering if provided
      if (startDate && endDate) {
        const startISO = startDate.toISOString();
        const endISO = endDate.toISOString();
        url += `?$filter=start/dateTime ge '${startISO}' and end/dateTime le '${endISO}'`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GraphResponse<OutlookEvent> = await response.json();
      return data.value;
    } catch (error) {
      console.error('Error fetching Outlook events:', error);
      return [];
    }
  }

  async getTodaysEvents(accessToken: string): Promise<OutlookEvent[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    return this.getEvents(accessToken, startOfDay, endOfDay);
  }

  formatEventForWidget(event: OutlookEvent) {
    const startTime = new Date(event.start.dateTime).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const endTime = new Date(event.end.dateTime).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      id: event.id,
      title: event.subject,
      startTime,
      endTime,
      category: this.mapCategoryFromOutlook(event.categories),
      hasOnlineLink: event.isOnlineMeeting,
      joinUrl: event.onlineMeeting?.joinUrl
    };
  }

  private mapCategoryFromOutlook(categories: string[]): 'work' | 'personal' | 'meeting' {
    if (categories.includes('Meeting') || categories.includes('Riunione')) {
      return 'meeting';
    }
    if (categories.includes('Work') || categories.includes('Lavoro')) {
      return 'work';
    }
    return 'personal';
  }
}

export const outlookAPI = new OutlookAPI();
