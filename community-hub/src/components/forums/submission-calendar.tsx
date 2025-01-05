'use client';

import { format, eachDayOfInterval, isSameDay, isAfter, isBefore, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';

interface Event {
  date: Date;
  type: 'submission' | 'quiz' | 'endterm' | 'content-release';
  title: string;
}

interface SubmissionCalendarProps {
  events: Event[];
  startDate: Date;
  endDate: Date;
}

export default function SubmissionCalendar({ events, startDate, endDate }: SubmissionCalendarProps) {
  // Get all days between start and end date
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Group days by weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  days.forEach((day) => {
    if (currentWeek.length === 0 || isSameDay(day, endOfWeek(currentWeek[0]))) {
      currentWeek.push(day);
    } else {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [day];
      } else {
        currentWeek.push(day);
      }
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getEventForDay = (day: Date) => {
    return events.find(event => isSameDay(new Date(event.date), day));
  };

  const getCellColor = (day: Date) => {
    const event = getEventForDay(day);
    const today = new Date('2025-01-05'); // Using the provided current date

    if (event) {
      switch (event.type) {
        case 'quiz':
          return 'bg-red-500 hover:bg-red-600';
        case 'endterm':
          return 'bg-purple-500 hover:bg-purple-600';
        case 'submission':
          return 'bg-blue-500 hover:bg-blue-600';
        case 'content-release':
          return 'bg-yellow-500 hover:bg-yellow-600';
      }
    }

    // Past days are green, future days are gray
    return isBefore(day, today) 
      ? 'bg-green-500 hover:bg-green-600' 
      : 'bg-gray-800 hover:bg-gray-500';
  };

  return (
    <div className="inline-block">
      <div className="flex flex-col gap-2">
        {/* Legend */}
        <div className="flex gap-4 text-sm mb-2 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Past Days</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Content Release</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Submissions</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Quizzes</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>End Term</span>
          </div>
        </div>

        {/* Calendar */}
        <div className="inline-grid grid-flow-col gap-2">
          {/* Days of week */}
          <div className="grid grid-rows-7 gap-2 text-sm mr-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="h-5 flex items-center">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-2">
              {week.map((day, dayIndex) => {
                const event = getEventForDay(day);
                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "w-5 h-5 rounded-sm cursor-pointer transition-colors",
                      getCellColor(day)
                    )}
                    title={event ? `${format(day, 'MMM d')} - ${event.title}` : format(day, 'MMM d')}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
