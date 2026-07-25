import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import { format, isSameDay, parseISO, isAfter, isBefore, addDays, startOfDay, endOfDay } from 'date-fns';
import { Bill, WorkOrder } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn, formatCurrency } from '../lib/utils';
import {
  overdueBillsList,
  overdueAmount as calcOverdueAmount,
  dueTodayBillsList,
  dueTodayAmount as calcDueTodayAmount,
} from '../lib/financialCalcs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  Calendar as CalendarIcon,
  Receipt,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface PaymentCalendarProps {
  bills: Bill[];
  workOrders: WorkOrder[];
}

export function PaymentCalendar({ bills, workOrders }: PaymentCalendarProps) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const HIGH_PAYABLE_THRESHOLD = 100000;
  const now = new Date();
  const today = startOfDay(now);
  const next7Days = endOfDay(addDays(today, 7));

  // ── Derived data ──
  const pendingBills = useMemo(() =>
    bills.filter(b => b.status !== 'PAID' && b.status !== 'REJECTED'),
    [bills]
  );

  const billsByDate = useMemo(() => {
    const map: Record<string, Bill[]> = {};
    pendingBills.forEach(bill => {
      const dateStr = format(parseISO(bill.billDate), 'yyyy-MM-dd');
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(bill);
    });
    return map;
  }, [pendingBills]);

  const dailyTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    Object.entries(billsByDate).forEach(([date, dayBills]) => {
      totals[date] = dayBills.reduce((sum, b) => sum + b.netPayable, 0);
    });
    return totals;
  }, [billsByDate]);

  // ── Key metrics (classification: Overdue < today < Due Today == today < Upcoming).
  // Overdue and Due Today are mutually exclusive; both are counted inside the 7-day window.
  const todayPayable = useMemo(() => calcDueTodayAmount(bills, now), [bills, now]);
  const todayBillCount = useMemo(() => dueTodayBillsList(bills, now).length, [bills, now]);

  const next7DaysPayable = useMemo(() =>
    pendingBills.filter(b => {
      const d = parseISO(b.billDate);
      return (isAfter(d, today) || isSameDay(d, today)) && isBefore(d, next7Days);
    }).reduce((sum, b) => sum + b.netPayable, 0),
    [pendingBills, today, next7Days]
  );

  const overdueAmount = useMemo(() => calcOverdueAmount(bills, now), [bills, now]);
  const overdueBillCount = useMemo(() => overdueBillsList(bills, now).length, [bills, now]);

  const highestDay = useMemo(() => {
    let max = { date: '', amount: 0 };
    Object.entries(dailyTotals).forEach(([date, amount]) => {
      if (amount > max.amount) max = { date, amount };
    });
    return max;
  }, [dailyTotals]);

  // ── Selected date ──
  const selectedDateBills = useMemo(() => {
    if (!selectedDate) return [];
    return billsByDate[format(selectedDate, 'yyyy-MM-dd')] || [];
  }, [selectedDate, billsByDate]);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    if (billsByDate[format(day, 'yyyy-MM-dd')]) {
      setIsDetailsOpen(true);
    }
  };

  const getWorkOrderTitle = (id: string) => workOrders.find(wo => wo.id === id)?.title || 'Unknown';
  const getWorkOrderNumber = (id: string) => workOrders.find(wo => wo.id === id)?.woNumber || 'N/A';

  // Modifier order matters: react-day-picker merges modifiersStyles in
  // declaration order, so later keys override earlier ones.
  //
  // Cell visual priority (highest first — declared LAST in modifiersStyles):
  //   1. overdueCell (diagonal dark-red stripes) — "late, act now"
  //   2. highPayable (solid red #ef4444)         — "large upcoming amount"
  //   3. dueTodayCell (amber fill + ring)        — "pay today"
  //   4. hasBills (bold + underline)             — "day has pending bills"
  //
  // overdueCell wins over highPayable when both match (overdue ≥₹1L cells
  // read as overdue — recency beats severity). highPayable still wins over
  // dueTodayCell (unchanged from previous behavior: a high-payable *today*
  // shows red, not amber).
  const modifiers = {
    hasBills: (date: Date) => !!billsByDate[format(date, 'yyyy-MM-dd')],
    dueTodayCell: (date: Date) =>
      isSameDay(date, today) && !!billsByDate[format(date, 'yyyy-MM-dd')],
    highPayable: (date: Date) => (dailyTotals[format(date, 'yyyy-MM-dd')] || 0) >= HIGH_PAYABLE_THRESHOLD,
    overdueCell: (date: Date) =>
      isBefore(date, today) && !!billsByDate[format(date, 'yyyy-MM-dd')],
  };
  const modifiersStyles = {
    hasBills: { fontWeight: 'bold' as const, textDecoration: 'underline' as const },
    // amber-100 background, amber-800 text, amber-500 ring.
    dueTodayCell: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      boxShadow: 'inset 0 0 0 1.5px #f59e0b',
    },
    // solid red — "large upcoming amount".
    highPayable: { color: 'white', backgroundColor: '#ef4444' },
    // diagonal stripes in red-700 / red-800 with a red-900 ring — visually
    // "late/warning", clearly distinct from the solid red highPayable tint.
    overdueCell: {
      color: 'white',
      backgroundColor: '#b91c1c',
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(0,0,0,0.22) 0 3px, transparent 3px 6px)',
      boxShadow: 'inset 0 0 0 1.5px #7f1d1d',
      textDecoration: 'none' as const,
    },
  };

  // ── Top upcoming payment (next unpaid bill by date) ──
  const nextUpcoming = useMemo(() => {
    const upcoming = pendingBills
      .filter(b => isAfter(parseISO(b.billDate), today) || isSameDay(parseISO(b.billDate), today))
      .sort((a, b) => parseISO(a.billDate).getTime() - parseISO(b.billDate).getTime());
    return upcoming[0] || null;
  }, [pendingBills, today]);

  return (
    <>
      <Card className="bg-white border-[#e5e7eb] shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#e5e7eb] bg-[#f9fafb] py-3 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-[#2563eb]" />
              Payment Schedule
            </CardTitle>
            <div className="flex items-center gap-3 text-[9px] font-bold uppercase text-[#6b7280]">
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-1.5 rounded-sm"
                  style={{
                    backgroundColor: '#b91c1c',
                    backgroundImage:
                      'repeating-linear-gradient(45deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 4px)',
                  }}
                />
                <span>Overdue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                <span>High (₹1L+)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Due Today</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                <span>Due</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* ── 3-section horizontal layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12">

            {/* Section 1: Compact Calendar (left) */}
            <div className="lg:col-span-4 p-4 border-b lg:border-b-0 lg:border-r border-[#e5e7eb] flex justify-center">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                onDayClick={handleDayClick}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="border-none p-0 text-xs"
                classNames={{
                  day_selected: "bg-[#2563eb] text-white hover:bg-[#1d4ed8] rounded-md",
                  day_today: "bg-slate-100 text-[#1e293b] font-black rounded-md",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-50 rounded-md transition-colors text-xs",
                  head_cell: "text-[#6b7280] rounded-md w-9 font-bold text-[8px] uppercase py-2",
                  table: "w-full border-collapse",
                  nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
                  caption: "flex justify-center pt-1 relative items-center mb-2",
                  caption_label: "text-xs font-black text-[#1e293b] uppercase tracking-widest",
                }}
                components={{
                  Day: ({ day, ...props }) => {
                    const date = day.date;
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const total = dailyTotals[dateStr];
                    const isOverdueCell = total > 0 && isBefore(date, today);
                    const isDueTodayCell = total > 0 && isSameDay(date, today);
                    // Sub-label color mirrors the cell background priority:
                    //   overdue (white on dark-red stripes) >
                    //   highPayable (white on solid red) >
                    //   dueToday (amber-800) >
                    //   default blue
                    const amountClass =
                      isOverdueCell ? "text-white" :
                      total >= HIGH_PAYABLE_THRESHOLD ? "text-white" :
                      isDueTodayCell ? "text-amber-800" :
                      "text-[#2563eb]";
                    return (
                      <div {...props} className={cn(props.className, "relative w-full h-full flex flex-col items-center justify-center")}>
                        <span className="text-xs z-10">{date.getDate()}</span>
                        {total > 0 && (
                          <span className={cn(
                            "text-[7px] font-black truncate max-w-[32px] leading-none",
                            amountClass
                          )}>
                            {total >= 100000 ? `${(total/100000).toFixed(1)}L` : `${(total/1000).toFixed(0)}k`}
                          </span>
                        )}
                      </div>
                    );
                  }
                }}
              />
            </div>

            {/* Section 2: Key Financial Metrics (center — dominant) */}
            <div className="lg:col-span-4 p-5 border-b lg:border-b-0 lg:border-r border-[#e5e7eb]">
              <div className="grid grid-cols-2 gap-4 h-full content-start">
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Clock className="h-3 w-3 text-amber-500" />
                    <p className="text-[9px] font-black uppercase text-[#6b7280]">Due Today</p>
                  </div>
                  <p className={cn("text-lg font-black", todayPayable > 0 ? "text-amber-600" : "text-[#111827]")}>
                    {formatCurrency(todayPayable)}
                  </p>
                  {todayBillCount > 0 && (
                    <p className="text-[9px] text-amber-600 font-bold mt-0.5">{todayBillCount} bill(s)</p>
                  )}
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="h-3 w-3 text-blue-500" />
                    <p className="text-[9px] font-black uppercase text-[#6b7280]">Next 7 Days</p>
                  </div>
                  <p className="text-lg font-black text-[#111827]">
                    {formatCurrency(next7DaysPayable)}
                  </p>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <p className="text-[9px] font-black uppercase text-[#6b7280]">Overdue</p>
                  </div>
                  <p className={cn("text-lg font-black", overdueAmount > 0 ? "text-red-600" : "text-emerald-600")}>
                    {formatCurrency(overdueAmount)}
                  </p>
                  {overdueBillCount > 0 && (
                    <p className="text-[9px] text-red-500 font-bold mt-0.5">{overdueBillCount} bill(s)</p>
                  )}
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CalendarIcon className="h-3 w-3 text-amber-500" />
                    <p className="text-[9px] font-black uppercase text-[#6b7280]">Peak Day</p>
                  </div>
                  <p className="text-lg font-black text-[#111827]">
                    {highestDay.amount > 0 ? formatCurrency(highestDay.amount) : '—'}
                  </p>
                  {highestDay.date && (
                    <p className="text-[9px] text-[#6b7280] font-bold mt-0.5">{format(parseISO(highestDay.date), 'MMM dd')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Alerts & Actions (right) */}
            <div className="lg:col-span-4 p-5 flex flex-col gap-4">
              {/* Status alert — priority: Overdue > Due Today > All Clear. */}
              {overdueAmount > 0 ? (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-red-700">Overdue Payments</p>
                    <p className="text-[10px] text-red-600 mt-0.5">{overdueBillCount} bill(s) totaling {formatCurrency(overdueAmount)} past due.</p>
                  </div>
                </div>
              ) : todayPayable > 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                  <Clock className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-amber-700">Due Today</p>
                    <p className="text-[10px] text-amber-600 mt-0.5">{todayBillCount} bill(s) totaling {formatCurrency(todayPayable)} due today.</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-emerald-700">All Clear</p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">No overdue or due-today payments.</p>
                  </div>
                </div>
              )}

              {/* Next upcoming payment */}
              {nextUpcoming && (
                <div className="p-3 bg-white border border-[#e5e7eb] rounded-xl">
                  <p className="text-[9px] font-black uppercase text-[#6b7280] mb-2">Next Payment Due</p>
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#111827] truncate">{getWorkOrderTitle(nextUpcoming.workOrderId)}</p>
                      <p className="text-[9px] text-[#6b7280] mt-0.5">{format(parseISO(nextUpcoming.billDate), 'MMM dd, yyyy')}</p>
                    </div>
                    <p className="text-sm font-black text-[#2563eb] shrink-0 ml-2">{formatCurrency(nextUpcoming.netPayable)}</p>
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div className="flex gap-2 mt-auto">
                <Button
                  variant="outline"
                  className="flex-1 h-8 text-[9px] font-black uppercase tracking-wider"
                  onClick={() => navigate('/payments')}
                >
                  View Payments <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-8 text-[9px] font-black uppercase tracking-wider"
                  onClick={() => navigate('/bills')}
                >
                  Manage Bills <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day detail dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-tight">
              Bills Due: {selectedDate && format(selectedDate, 'MMM dd, yyyy')}
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-[#6b7280]">
              Detailed breakdown of payment obligations for this date.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] mt-4 pr-4">
            <div className="space-y-3">
              {selectedDateBills.map(bill => (
                <div key={bill.id} className="p-4 bg-slate-50 border border-[#e5e7eb] rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-white text-[#2563eb] border-[#e5e7eb] text-[9px] font-black uppercase">
                      {getWorkOrderNumber(bill.workOrderId)}
                    </Badge>
                    <span className="text-sm font-black text-[#1e293b]">{formatCurrency(bill.netPayable)}</span>
                  </div>
                  <p className="text-sm font-bold text-[#1e293b] mb-1">
                    {getWorkOrderTitle(bill.workOrderId)}
                  </p>
                  <p className="text-[10px] text-[#6b7280] font-medium">
                    Bill: {bill.billNumber}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
