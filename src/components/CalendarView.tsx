
import { useState, useEffect } from 'react';
import { Calendar, Clock, Video } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: 'work' | 'personal' | 'meeting';
  hasOnlineLink?: boolean;
}

const CalendarView = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Mock events for demonstration
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Team Meeting',
        startTime: '09:00',
        endTime: '10:00',
        category: 'meeting',
        hasOnlineLink: true
      },
      {
        id: '2',
        title: 'Project Review',
        startTime: '14:30',
        endTime: '15:30',
        category: 'work'
      },
      {
        id: '3',
        title: 'Doctor Appointment',
        startTime: '16:00',
        endTime: '17:00',
        category: 'personal'
      }
    ];
    setEvents(mockEvents);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-blue-500/20 border-blue-400 text-blue-200';
      case 'personal': return 'bg-green-500/20 border-green-400 text-green-200';
      case 'meeting': return 'bg-purple-500/20 border-purple-400 text-purple-200';
      default: return 'bg-gray-500/20 border-gray-400 text-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-blue-400" />
        <div>
          <h2 className="text-white font-semibold">Today's Events</h2>
          <p className="text-white/60 text-sm capitalize">{formatDate(currentDate)}</p>
        </div>
      </div>

      <div className="space-y-2">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className={`p-3 rounded-lg border ${getCategoryColor(event.category)} backdrop-blur-sm transition-all hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm">{event.title}</h3>
                {event.hasOnlineLink && (
                  <Video className="w-4 h-4 text-blue-300" />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs opacity-80">
                <Clock className="w-3 h-3" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-white/50">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No events today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
