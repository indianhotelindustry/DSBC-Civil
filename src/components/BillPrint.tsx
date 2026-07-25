import React from 'react';
import { Bill, WorkOrder, Project, Contractor, Company, SubLocation } from '../types';
import { formatCurrency } from '../lib/utils';

interface BillPrintProps {
  bill: Bill;
  workOrder?: WorkOrder;
  project?: Project;
  contractor?: Contractor;
  company?: Company;
  subLocation?: SubLocation;
}

/**
 * A4 print layout for a Bill. Structurally distinct from WorkOrderPrint
 * because a bill shows: amount history, deductions, payment state, and
 * the linked WO reference — not a BOQ / scope of work.
 *
 * The outer wrapper carries the `print-document` class that the global
 * print CSS (index.css) targets to hide app chrome and reveal only this
 * document when the user fires window.print().
 */
export function BillPrint({ bill, workOrder, project, contractor, company, subLocation }: BillPrintProps) {
  const deductionsTotal = bill.tdsAmount + bill.retentionAmount + bill.advanceAdjustment;

  const statusLabel = (() => {
    switch (bill.status) {
      case 'DRAFT':         return 'Draft';
      case 'VERIFIED':      return 'Verified';
      case 'APPROVED':      return 'Approved';
      case 'PARTIALLY_PAID':return 'Partially Paid';
      case 'PAID':          return 'Paid';
      case 'REJECTED':      return 'Rejected';
      default:              return bill.status;
    }
  })();

  const statusCls =
    bill.status === 'PAID' ? 'bg-[#065f46] text-white' :
    bill.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
    bill.status === 'VERIFIED' ? 'bg-blue-100 text-blue-800' :
    bill.status === 'PARTIALLY_PAID' ? 'bg-amber-100 text-amber-800' :
    bill.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
    'bg-slate-100 text-slate-700';

  return (
    <div className="print-document bg-white p-8 max-w-[210mm] mx-auto text-[#1f2937] print:p-0 font-sans border border-[#e5e7eb] print:border-0 shadow-lg print:shadow-none">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-[#1f2937] pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-[#1f2937] mb-1">{company?.name || 'SIPL CONSTRUCTION'}</h1>
          {company?.tagline && <p className="text-xs uppercase tracking-widest font-bold text-[#6b7280]">{company.tagline}</p>}
          <div className="mt-4 text-[10px] space-y-0.5 text-[#4b5563]">
            {company?.address && <p>{company.address}</p>}
            <p>{company?.phone ? `Phone: ${company.phone}` : ''}{company?.email ? ` | Email: ${company.email}` : ''}</p>
            {company?.gstin && <p>GSTIN: {company.gstin}</p>}
          </div>
        </div>
        <div className="text-right">
          <div className="bg-[#1f2937] text-white px-4 py-2 inline-block mb-4">
            <h2 className="text-xl font-bold tracking-widest uppercase">Bill</h2>
          </div>
          <div className="text-sm space-y-1">
            <p><span className="font-bold text-[#6b7280] uppercase text-[10px]">Bill No:</span> <span className="font-mono font-bold">{bill.billNumber}</span></p>
            <p><span className="font-bold text-[#6b7280] uppercase text-[10px]">Bill Date:</span> {bill.billDate}</p>
            <p className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${statusCls}`}>{statusLabel}</p>
          </div>
        </div>
      </div>

      {/* Details grid — linked WO + contractor on left, project on right */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-2">Linked Work Order</h3>
            <div className="bg-[#f9fafb] p-3 rounded border border-[#e5e7eb] space-y-1">
              <p className="text-sm font-bold">{workOrder?.woNumber || 'N/A'}</p>
              <p className="text-[11px] text-[#6b7280]">{workOrder?.title || ''}</p>
              {workOrder?.workCategory && (
                <p className="text-[11px] font-medium mt-2">Category: <span className="text-[#1f2937]">{workOrder.workCategory}</span></p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-2">Contractor</h3>
            <div className="bg-[#f9fafb] p-3 rounded border border-[#e5e7eb] space-y-1">
              <p className="text-sm font-bold">{contractor?.name || 'N/A'}</p>
              <p className="text-[11px] text-[#6b7280]">{contractor?.address || ''}</p>
              <p className="text-[11px] font-medium mt-2">Phone: <span className="text-[#1f2937]">{contractor?.phone || 'N/A'}</span></p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-2">Project</h3>
            <div className="bg-[#f9fafb] p-3 rounded border border-[#e5e7eb] space-y-1">
              <p className="text-sm font-bold">{project?.name || 'N/A'}</p>
              {subLocation && <p className="text-[11px] font-medium text-[#2563eb]">{subLocation.type}: {subLocation.name}</p>}
              <p className="text-[11px] text-[#6b7280]">{project?.description || ''}</p>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-2">Billing Period</h3>
            <div className="bg-[#f9fafb] p-3 rounded border border-[#e5e7eb] space-y-1">
              <p className="text-[11px]">Previous billed: <strong>{formatCurrency(bill.previousBillAmount)}</strong></p>
              <p className="text-[11px]">Current bill: <strong>{formatCurrency(bill.currentBillAmount || (bill.previousBillAmount + bill.workDoneAmount))}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Amount breakdown — table makes the figures scannable on paper */}
      <div className="mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-2">Amount Breakdown</h3>
        <table className="w-full text-left border-collapse border border-[#e5e7eb] text-xs">
          <tbody>
            <tr>
              <td className="border border-[#e5e7eb] px-3 py-2 text-[#6b7280]">Work Done (Current Bill)</td>
              <td className="border border-[#e5e7eb] px-3 py-2 text-right font-mono font-bold">{formatCurrency(bill.workDoneAmount)}</td>
            </tr>
            <tr>
              <td className="border border-[#e5e7eb] px-3 py-2 text-[#6b7280]">TDS ({bill.tdsPercentage}%)</td>
              <td className="border border-[#e5e7eb] px-3 py-2 text-right font-mono text-red-700">-{formatCurrency(bill.tdsAmount)}</td>
            </tr>
            <tr>
              <td className="border border-[#e5e7eb] px-3 py-2 text-[#6b7280]">Retention ({bill.retentionPercentage}%)</td>
              <td className="border border-[#e5e7eb] px-3 py-2 text-right font-mono text-amber-700">-{formatCurrency(bill.retentionAmount)}</td>
            </tr>
            <tr>
              <td className="border border-[#e5e7eb] px-3 py-2 text-[#6b7280]">Advance Adjustment</td>
              <td className="border border-[#e5e7eb] px-3 py-2 text-right font-mono text-red-700">-{formatCurrency(bill.advanceAdjustment)}</td>
            </tr>
            <tr className="bg-[#f9fafb]">
              <td className="border border-[#e5e7eb] px-3 py-2 font-bold">Total Deductions</td>
              <td className="border border-[#e5e7eb] px-3 py-2 text-right font-mono font-bold text-red-700">-{formatCurrency(deductionsTotal)}</td>
            </tr>
            <tr className="bg-[#1f2937] text-white">
              <td className="border border-[#1f2937] px-3 py-3 font-black uppercase tracking-widest">Net Payable</td>
              <td className="border border-[#1f2937] px-3 py-3 text-right font-mono text-lg font-black">{formatCurrency(bill.netPayable)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Approval trail — keep together on one page */}
      <div className="print-keep-together mb-8" style={{ pageBreakInside: 'avoid' }}>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-2">Approval Trail</h3>
        <table className="w-full text-left border-collapse border border-[#e5e7eb] text-xs">
          <thead>
            <tr className="bg-[#f9fafb] text-[10px] uppercase tracking-wider font-bold">
              <th className="border border-[#e5e7eb] px-3 py-2">Stage</th>
              <th className="border border-[#e5e7eb] px-3 py-2">Status</th>
              <th className="border border-[#e5e7eb] px-3 py-2">Date</th>
              <th className="border border-[#e5e7eb] px-3 py-2">By</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[#e5e7eb] px-3 py-2 font-medium">Verification (PM)</td>
              <td className="border border-[#e5e7eb] px-3 py-2">{bill.verifiedAt ? 'Verified' : 'Pending'}</td>
              <td className="border border-[#e5e7eb] px-3 py-2">{bill.verifiedAt ? bill.verifiedAt.slice(0, 10) : '—'}</td>
              <td className="border border-[#e5e7eb] px-3 py-2">{bill.verifiedBy || '—'}</td>
            </tr>
            <tr>
              <td className="border border-[#e5e7eb] px-3 py-2 font-medium">Approval (CEO/Admin)</td>
              <td className="border border-[#e5e7eb] px-3 py-2">{bill.approvedAt ? 'Approved' : 'Pending'}</td>
              <td className="border border-[#e5e7eb] px-3 py-2">{bill.approvedAt ? bill.approvedAt.slice(0, 10) : '—'}</td>
              <td className="border border-[#e5e7eb] px-3 py-2">{bill.approvedBy || '—'}</td>
            </tr>
            <tr>
              <td className="border border-[#e5e7eb] px-3 py-2 font-medium">Payment Release (Accounts)</td>
              <td className="border border-[#e5e7eb] px-3 py-2">{bill.paidAt ? 'Paid' : 'Pending'}</td>
              <td className="border border-[#e5e7eb] px-3 py-2">{bill.paidAt ? bill.paidAt.slice(0, 10) : '—'}</td>
              <td className="border border-[#e5e7eb] px-3 py-2">{bill.paidBy || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signatures */}
      <div className="print-keep-together grid grid-cols-3 gap-8 pt-12 border-t border-[#e5e7eb]" style={{ pageBreakInside: 'avoid' }}>
        <div className="text-center space-y-8">
          <div className="h-12 border-b border-dashed border-[#9ca3af]"></div>
          <div>
            <p className="text-[10px] font-bold uppercase truncate">{bill.verifiedBy || '________________'}</p>
            <p className="text-[9px] font-bold text-[#6b7280] uppercase tracking-widest">Verified By (PM)</p>
          </div>
        </div>
        <div className="text-center space-y-8">
          <div className="h-12 border-b border-dashed border-[#9ca3af]"></div>
          <div>
            <p className="text-[10px] font-bold uppercase truncate">{bill.approvedBy || '________________'}</p>
            <p className="text-[9px] font-bold text-[#6b7280] uppercase tracking-widest">Approved By</p>
          </div>
        </div>
        <div className="text-center space-y-8">
          <div className="h-12 border-b border-dashed border-[#9ca3af]"></div>
          <div>
            <p className="text-[10px] font-bold uppercase truncate">{contractor?.name || '________________'}</p>
            <p className="text-[9px] font-bold text-[#6b7280] uppercase tracking-widest">Contractor Signature</p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[8px] text-[#9ca3af] uppercase tracking-[0.4em]">
          This is a computer generated document. No physical signature required if digitally approved.
        </p>
      </div>
    </div>
  );
}
