import React, { useEffect, useState } from 'react';
import { Bell, X, AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';
import { alertService } from '../services/alertService';
import { Alert } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';

export function AlertBell() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsub = alertService.getAll(setAlerts);
    return () => unsub();
  }, []);

  const unreadCount = alerts.filter(a => !a.read).length;

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'MEDIUM': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'LOW': return 'text-slate-600 bg-slate-50 border-slate-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'CRITICAL': return <AlertCircle className="h-4 w-4" />;
      case 'HIGH': return <AlertTriangle className="h-4 w-4" />;
      case 'MEDIUM': return <Info className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="relative text-[#6b7280]">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </Button>
        }
      />
      <SheetContent className="w-[400px] p-0 border-none shadow-2xl">
        <div className="flex flex-col h-full bg-white">
          <SheetHeader className="p-6 border-b border-[#e5e7eb] bg-[#f9fafb]">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-black uppercase tracking-tight">Notifications</SheetTitle>
              {unreadCount > 0 && (
                <Badge className="bg-[#2563eb] text-white text-[10px] font-black uppercase">
                  {unreadCount} New
                </Badge>
              )}
            </div>
          </SheetHeader>
          
          <ScrollArea className="flex-1">
            <div className="divide-y divide-[#e5e7eb]">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={cn(
                      "p-6 transition-colors hover:bg-[#f9fafb] relative group",
                      !alert.read && "bg-blue-50/30"
                    )}
                  >
                    <div className="flex gap-4">
                      <div className={cn(
                        "mt-1 p-2 rounded-xl border flex-shrink-0",
                        getSeverityColor(alert.severity)
                      )}>
                        {getIcon(alert.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">
                            {alert.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-bold text-[#9ca3af]">
                            {new Date(alert.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm leading-relaxed",
                          alert.read ? "text-[#6b7280]" : "text-[#111827] font-bold"
                        )}>
                          {alert.message}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          {!alert.read && (
                            <button 
                              onClick={() => alertService.markAsRead(alert.id)}
                              className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] hover:underline flex items-center"
                            >
                              <Check className="h-3 w-3 mr-1" /> Mark as read
                            </button>
                          )}
                          <button 
                            onClick={() => alertService.delete(alert.id)}
                            className="text-[10px] font-black uppercase tracking-widest text-rose-600 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
                  <div className="p-4 rounded-full bg-slate-50 mb-4">
                    <Bell className="h-8 w-8 text-[#e5e7eb]" />
                  </div>
                  <p className="text-sm font-bold text-[#111827]">All caught up!</p>
                  <p className="text-xs text-[#6b7280] mt-1">No new alerts to show right now.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
