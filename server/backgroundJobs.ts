/**
 * Background jobs: alert engine and daily summary generator.
 *
 * Uses shared helpers from src/lib/financialCalcs.ts so server-side
 * alerts/summaries apply the exact same bill-inclusion and windowing
 * rules as the client dashboards. Do not inline payable/overdue math here.
 */

import { addDays, isBefore, startOfDay, endOfDay, parseISO } from "date-fns";
import { db } from "./firebaseAdmin.ts";
import type { Bill } from "../src/types.ts";
import {
  overdueBillsList,
  payableInWindow,
  pendingBills,
} from "../src/lib/financialCalcs.ts";

async function createAlert(alertData: { message: string; severity: string; type: string; relatedId?: string }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const existing = await db.collection("alerts")
    .where("type", "==", alertData.type)
    .where("relatedId", "==", alertData.relatedId || "none")
    .where("timestamp", ">=", todayStr)
    .limit(1)
    .get();

  if (existing.empty) {
    await db.collection("alerts").add({
      ...alertData,
      relatedId: alertData.relatedId || "none",
      timestamp: new Date().toISOString(),
      read: false
    });
  }
}

async function fetchActiveBills(): Promise<Bill[]> {
  // Status filter matches pendingBills() from financialCalcs — bills that still owe money.
  const snap = await db.collection("bills")
    .where("status", "in", ["DRAFT", "VERIFIED", "APPROVED", "PARTIALLY_PAID"])
    .get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bill));
}

export async function runAlertEngine(): Promise<void> {
  console.log("[background] Running Alert Engine...");
  const now = new Date();
  const today = startOfDay(now);
  const in3Days = endOfDay(addDays(today, 3));

  try {
    const bills = await fetchActiveBills();

    // Overdue bills — uses shared helper for consistency with dashboard.
    for (const bill of overdueBillsList(bills)) {
      await createAlert({
        message: `Overdue Payment: Bill for ₹${bill.netPayable.toLocaleString()} is overdue.`,
        severity: "HIGH",
        type: "OVERDUE",
        relatedId: bill.id
      });
    }

    // Upcoming (next 3 days, not yet overdue).
    for (const bill of pendingBills(bills)) {
      const d = parseISO(bill.billDate);
      if (!isBefore(d, today) && isBefore(d, in3Days)) {
        await createAlert({
          message: `Upcoming Payment: Bill for ₹${bill.netPayable.toLocaleString()} is due within 3 days.`,
          severity: "MEDIUM",
          type: "PAYMENT_DUE",
          relatedId: bill.id
        });
      }
    }

    // High payable alert — same 15-day window used on CEO dashboard.
    const highPayableThreshold = 100000;
    const totalUpcoming = payableInWindow(bills, today, endOfDay(addDays(today, 15)));
    if (totalUpcoming >= highPayableThreshold) {
      await createAlert({
        message: `High Liability Alert: ₹${totalUpcoming.toLocaleString()} is payable within the next 15 days.`,
        severity: "CRITICAL",
        type: "HIGH_PAYABLE"
      });
    }

    console.log("[background] Alert Engine completed.");
  } catch (error) {
    console.error("[background] Alert Engine failed:", error);
  }
}

export async function runSummaryGenerator(): Promise<void> {
  console.log("[background] Running Daily Summary Generator...");
  const now = new Date();
  const today = startOfDay(now);

  try {
    const bills = await fetchActiveBills();

    const workOrdersSnapshot = await db.collection("workOrders").get();
    const workOrders = workOrdersSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data().title;
      return acc;
    }, {} as Record<string, string>);

    const pending = pendingBills(bills);
    const totalOutstanding = pending.reduce((sum, b) => sum + b.netPayable, 0);
    const overdue = overdueBillsList(bills);
    const overdueAmt = overdue.reduce((sum, b) => sum + b.netPayable, 0);
    const payable7Days = payableInWindow(bills, today, endOfDay(addDays(today, 7)));

    const riskItems = [...pending]
      .sort((a, b) => b.netPayable - a.netPayable)
      .slice(0, 3)
      .map(b => ({
        title: workOrders[b.workOrderId] || "Unknown Work Order",
        amount: b.netPayable,
        dueDate: b.billDate,
        type: isBefore(parseISO(b.billDate), today) ? "OVERDUE" : "UPCOMING"
      }));

    const dateStr = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    let formattedText = `*DAILY FINANCIAL SUMMARY - ${dateStr}*\n\n`;
    formattedText += `*Total Outstanding:* INR ${totalOutstanding.toLocaleString('en-IN')}\n`;
    formattedText += `*Overdue Amount:* INR ${overdueAmt.toLocaleString('en-IN')}\n`;
    formattedText += `*Payable (Next 7 Days):* INR ${payable7Days.toLocaleString('en-IN')}\n\n`;
    formattedText += `*TOP 3 RISK ITEMS:*\n`;
    riskItems.forEach((item, i) => {
      formattedText += `${i + 1}. ${item.title}\n`;
      formattedText += `   Amount: INR ${item.amount.toLocaleString('en-IN')}\n`;
      formattedText += `   Due: ${item.dueDate} (${item.type})\n\n`;
    });
    formattedText += `_Generated by DSBC Civil — Enterprise Construction ERP Platform_`;

    await db.collection("dailySummaries").add({
      date: today.toISOString().split('T')[0],
      totalOutstanding,
      payable7Days,
      overdueAmount: overdueAmt,
      topRiskItems: riskItems,
      formattedText,
      createdAt: new Date().toISOString()
    });

    console.log("[background] Daily Summary generated.");
  } catch (error) {
    console.error("[background] Summary Generator failed:", error);
  }
}
