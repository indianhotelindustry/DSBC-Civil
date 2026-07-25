import React, { useEffect, useState } from 'react';
import { Save, Hash, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { numberSeriesService, formatSeriesNumber, WORK_ORDER_SERIES_DEFAULT } from '../services/numberSeriesService';
import { NumberSeries } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function WorkOrderNumberSeries() {
  const { isAdmin } = useAuth();
  const [series, setSeries] = useState<NumberSeries | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [prefix, setPrefix] = useState('WO');
  const [year, setYear] = useState(new Date().getFullYear());
  const [nextNumber, setNextNumber] = useState(1);
  const [paddingLength, setPaddingLength] = useState(4);
  const [includeYear, setIncludeYear] = useState(true);

  useEffect(() => {
    const unsub = numberSeriesService.subscribeWorkOrderSeries((s) => {
      setSeries(s);
      setLoaded(true);
      if (s) {
        setPrefix(s.prefix);
        setYear(s.year);
        setNextNumber(s.nextNumber);
        setPaddingLength(s.paddingLength);
        setIncludeYear(s.includeYear);
      } else {
        setPrefix(WORK_ORDER_SERIES_DEFAULT.prefix);
        setYear(WORK_ORDER_SERIES_DEFAULT.year);
        setNextNumber(WORK_ORDER_SERIES_DEFAULT.nextNumber);
        setPaddingLength(WORK_ORDER_SERIES_DEFAULT.paddingLength);
        setIncludeYear(WORK_ORDER_SERIES_DEFAULT.includeYear);
      }
    });
    return () => unsub();
  }, []);

  const previewNumber = formatSeriesNumber(
    { id: 'workOrder', prefix, year, nextNumber, paddingLength, includeYear },
    nextNumber
  );

  const canSubmit = isAdmin && !submitting && !!prefix.trim();

  const handleSave = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await numberSeriesService.updateWorkOrderSeries({
        prefix: prefix.trim(),
        year,
        nextNumber: Math.max(1, Math.floor(nextNumber)),
        paddingLength: Math.max(1, Math.floor(paddingLength)),
        includeYear,
      });
      toast.success(series ? 'Series updated' : 'Series initialized');
    } catch (err) {
      toast.error('Failed to save series');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Work Order Number Series</h2>
        <p className="text-sm text-[#6b7280]">
          Controls how new Work Order numbers are generated. The next number is reserved atomically
          on every Create, so two concurrent creates can never receive the same WO#.
        </p>
      </div>

      {!series && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-900">
            <p className="font-bold">No series configured yet — using fallback timestamps.</p>
            <p className="text-amber-700 mt-0.5">
              Save below to initialize the series. Existing Work Orders keep their original numbers.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm space-y-4 max-w-xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="ns-prefix">Prefix</Label>
            <Input id="ns-prefix" value={prefix} onChange={(e) => setPrefix(e.target.value.toUpperCase())} disabled={!isAdmin} placeholder="WO" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ns-year">Year</Label>
            <Input id="ns-year" type="number" value={year} onChange={(e) => setYear(+e.target.value)} disabled={!isAdmin || !includeYear} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ns-next">Next Number</Label>
            <Input id="ns-next" type="number" min={1} value={nextNumber} onChange={(e) => setNextNumber(+e.target.value)} disabled={!isAdmin} />
            <p className="text-[10px] text-[#9ca3af]">The next Work Order created will use this number, then the counter increments.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ns-pad">Padding length</Label>
            <Input id="ns-pad" type="number" min={1} max={10} value={paddingLength} onChange={(e) => setPaddingLength(+e.target.value)} disabled={!isAdmin} />
            <p className="text-[10px] text-[#9ca3af]">e.g. 4 → "0001". 5 → "00001".</p>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includeYear}
            onChange={(e) => setIncludeYear(e.target.checked)}
            disabled={!isAdmin}
          />
          Include year in number (auto-resets the counter on calendar year rollover)
        </label>

        <div className="rounded-lg bg-[#f9fafb] border border-[#e5e7eb] p-3 flex items-center gap-3">
          <Hash className="h-4 w-4 text-[#2563eb]" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Preview</p>
            <p className="text-sm font-mono font-bold">{previewNumber}</p>
          </div>
        </div>

        {isAdmin && (
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={!canSubmit} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
              <Save className="mr-2 h-4 w-4" /> {series ? 'Save Changes' : 'Initialize Series'}
            </Button>
          </div>
        )}
        {!isAdmin && (
          <p className="text-[11px] text-[#6b7280]">Only admins can edit this series.</p>
        )}
      </div>
    </div>
  );
}
