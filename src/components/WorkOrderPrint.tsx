import React from 'react';
import { WorkOrder, Project, Contractor, Company, SubLocation } from '../types';
import { formatCurrency } from '../lib/utils';

interface WorkOrderPrintProps {
  workOrder: WorkOrder;
  project?: Project;
  contractor?: Contractor;
  company?: Company;
  subLocation?: SubLocation;
}

export function WorkOrderPrint({ workOrder, project, contractor, company, subLocation }: WorkOrderPrintProps) {
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
            <h2 className="text-xl font-bold tracking-widest uppercase">Work Order</h2>
          </div>
          <div className="text-sm space-y-1">
            <p><span className="font-bold text-[#6b7280] uppercase text-[10px]">WO Number:</span> <span className="font-mono font-bold">{workOrder.woNumber}</span></p>
            <p><span className="font-bold text-[#6b7280] uppercase text-[10px]">Date:</span> {workOrder.issueDate}</p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-2">Project Details</h3>
            <div className="bg-[#f9fafb] p-3 rounded border border-[#e5e7eb] space-y-1">
              <p className="text-sm font-bold">{project?.name || 'N/A'}</p>
              {subLocation && <p className="text-[11px] font-medium text-[#2563eb]">{subLocation.type}: {subLocation.name}</p>}
              <p className="text-[11px] text-[#6b7280]">{workOrder.location || project?.description || 'N/A'}</p>
              <p className="text-[11px] font-medium mt-2">Category: <span className="text-[#1f2937]">{workOrder.workCategory || 'General'}</span></p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-bold uppercase text-[#6b7280]">Start Date</p>
              <p className="text-xs font-bold">{workOrder.startDate}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-[#6b7280]">End Date</p>
              <p className="text-xs font-bold">{workOrder.endDate}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-2">Contractor Details</h3>
            <div className="bg-[#f9fafb] p-3 rounded border border-[#e5e7eb] space-y-1">
              <p className="text-sm font-bold">{contractor?.name || 'N/A'}</p>
              <p className="text-[11px] text-[#6b7280]">{contractor?.address || 'N/A'}</p>
              <p className="text-[11px] font-medium mt-2">GSTIN: <span className="text-[#1f2937]">{workOrder.contractorGST || 'N/A'}</span></p>
              <p className="text-[11px] font-medium">Phone: <span className="text-[#1f2937]">{contractor?.phone || 'N/A'}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* BOQ Table */}
      <div className="mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-2">Bill of Quantities (BOQ)</h3>
        <table className="w-full text-left border-collapse border border-[#e5e7eb]">
          <thead>
            <tr className="bg-[#f9fafb] text-[10px] uppercase tracking-wider font-bold">
              <th className="border border-[#e5e7eb] px-3 py-2">#</th>
              <th className="border border-[#e5e7eb] px-3 py-2">Description</th>
              <th className="border border-[#e5e7eb] px-3 py-2">Unit</th>
              <th className="border border-[#e5e7eb] px-3 py-2 text-right">Qty</th>
              <th className="border border-[#e5e7eb] px-3 py-2 text-right">Rate</th>
              <th className="border border-[#e5e7eb] px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {workOrder.boqItems.map((item, index) => (
              <tr key={index}>
                <td className="border border-[#e5e7eb] px-3 py-2 text-[#6b7280]">{index + 1}</td>
                <td className="border border-[#e5e7eb] px-3 py-2 font-medium">{item.description}</td>
                <td className="border border-[#e5e7eb] px-3 py-2">{item.unit}</td>
                <td className="border border-[#e5e7eb] px-3 py-2 text-right">{item.quantity}</td>
                <td className="border border-[#e5e7eb] px-3 py-2 text-right">{formatCurrency(item.rate)}</td>
                <td className="border border-[#e5e7eb] px-3 py-2 text-right font-mono">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scope and Financial Summary */}
      <div className="grid grid-cols-2 gap-12 mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-2">Scope of Work</h3>
          <p className="text-[11px] leading-relaxed text-[#4b5563] whitespace-pre-wrap">{workOrder.scopeOfWork}</p>
          {workOrder.additionalNotes && (
            <div className="mt-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-2">Additional Notes</h3>
              <p className="text-[10px] leading-relaxed text-[#6b7280] whitespace-pre-wrap">{workOrder.additionalNotes}</p>
            </div>
          )}
        </div>

        <div className="bg-[#f9fafb] p-4 rounded-lg border border-[#e5e7eb]">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-4">Financial Summary</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Total Work Order Value</span>
              <span className="font-bold">{formatCurrency(workOrder.financials.totalAmount)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[#6b7280]">
                Retention Amount (Payable after Work Completion with 100% Accuracy) ({workOrder.financials.retentionPercentage || 0}%)
              </span>
              <span className="text-amber-600 whitespace-nowrap">-{formatCurrency(workOrder.financials.retentionAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Less: Advance Paid</span>
              <span className="text-red-600">-{formatCurrency(workOrder.financials.advance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">GST ({workOrder.financials.gstPercentage || 0}%)</span>
              <span>+{formatCurrency(workOrder.financials.gstAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Other Charges</span>
              <span>+{formatCurrency(workOrder.financials.otherCharges)}</span>
            </div>
            <div className="pt-3 mt-2 border-t-2 border-[#1f2937] flex justify-between items-end">
              <span className="text-sm font-black uppercase">Remaining Amount</span>
              <span className="text-xl font-black text-[#2563eb]">{formatCurrency(workOrder.financials.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions — full width, Hindi heading, avoid page-break split */}
      {workOrder.termsAndConditions && (
        <div className="mb-12 border-t border-[#e5e7eb] pt-6" style={{ pageBreakInside: 'avoid' }}>
          <h3 className="text-xs font-black text-[#1f2937] mb-3">
            नियम एवं शर्तें <span className="text-[#6b7280] font-normal ml-2">/ Terms & Conditions</span>
          </h3>
          <p className="text-[10px] leading-relaxed text-[#4b5563] whitespace-pre-wrap font-[sans-serif]" dir="auto">
            {workOrder.termsAndConditions}
          </p>
        </div>
      )}

      {/* Signatures */}
      <div className="print-keep-together grid grid-cols-3 gap-8 pt-12 border-t border-[#e5e7eb]" style={{ pageBreakInside: 'avoid' }}>
        <div className="text-center space-y-8">
          <div className="h-12 border-b border-dashed border-[#9ca3af]"></div>
          <div>
            <p className="text-[10px] font-bold uppercase truncate">{workOrder.preparedBy || '________________'}</p>
            <p className="text-[9px] font-bold text-[#6b7280] uppercase tracking-widest">Prepared By</p>
          </div>
        </div>
        <div className="text-center space-y-8">
          <div className="h-12 border-b border-dashed border-[#9ca3af]"></div>
          <div>
            <p className="text-[10px] font-bold uppercase truncate">{workOrder.approvedBy || '________________'}</p>
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
        <p className="text-[8px] text-[#9ca3af] uppercase tracking-[0.4em]">This is a computer generated document. No physical signature required if digitally approved.</p>
      </div>
    </div>
  );
}
