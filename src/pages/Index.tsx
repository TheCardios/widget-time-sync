
import { useState, useEffect } from 'react';
import CalendarView from '@/components/CalendarView';
import ToDoList from '@/components/ToDoList';
import NotificationManager from '@/components/NotificationManager';
import { requestNotificationPermission } from '@/utils/notify';

const Index = () => {
  useEffect(() => {
    // Request notification permission on app start
    requestNotificationPermission();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10">
            <h1 className="text-white text-xl font-semibold">My Widget</h1>
            <p className="text-white/70 text-sm">Calendar & Tasks</p>
          </div>
          
          {/* Calendar Section */}
          <div className="p-4 border-b border-white/10">
            <CalendarView />
          </div>
          
          {/* To-Do Section */}
          <div className="p-4">
            <ToDoList />
          </div>
        </div>
        
        {/* Notification Manager */}
        <NotificationManager />
      </div>
    </div>
  );
};

export default Index;
