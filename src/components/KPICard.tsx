import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { cn, formatCurrency } from '../lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: string;
  isCurrency?: boolean;
  /** When set, the card becomes a clickable link to this route. The
   *  hover affordance is bumped (cursor + ring) so the user can tell.
   *  Pass relative paths only — `/work-orders?status=APPROVED`, etc. */
  href?: string;
}

export function KPICard({ title, value, icon: Icon, trend, color, isCurrency = true, href }: KPICardProps) {
  const card = (
    <Card
      className={cn(
        'overflow-hidden border-[#e5e7eb] shadow-sm bg-white transition-shadow',
        href ? 'cursor-pointer hover:shadow-md hover:ring-1 hover:ring-[#2563eb]/30' : 'hover:shadow-md'
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#6b7280]">{title}</p>
          {Icon && (
            <div className={cn("p-1.5 rounded-md", color || "bg-blue-50 text-blue-600")}>
              <Icon className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-xl font-black tracking-tight text-[#111827]">
              {isCurrency ? formatCurrency(value) : value}
            </h3>
            {trend && (
              <div className={cn(
                "flex items-center mt-1 text-[10px] font-bold",
                trend.isUp ? "text-emerald-600" : "text-rose-600"
              )}>
                {trend.isUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {trend.value}%
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  return href ? (
    <Link to={href} title={title} className="block">{card}</Link>
  ) : card;
}
