"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
// Removed supabase import - using backend API instead

interface KPIs {
  mrr: number;
  arr: number;
  expensesMonthly: number;
  profitMonthly: number;
  invoicesOverdue: number;
}

interface Invoice {
  id: string;
  client: string;
  amount: number;
  currency: string;
  issuedAt: string;
  dueAt: string;
  status: "Paid" | "Unpaid" | "Overdue";
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  currency: string;
}

interface FinancesResponse {
  kpis: KPIs;
  invoices: Invoice[];
  expenses: Expense[];
}

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toLocaleString("pl-PL")} ${currency}`;
  }
}

function Badge({ status }: { status: Invoice["status"] }) {
  const map = {
    Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Unpaid: "bg-amber-100 text-amber-700 border-amber-200",
    Overdue: "bg-red-100 text-red-700 border-red-200",
  } as const;
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${map[status]}`}>{status}</span>
  );
}

export default function FinancesPage() {
  const { data, isLoading, error } = useQuery<FinancesResponse>({
    queryKey: ["finances"],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/finances');
      if (!response.ok) throw new Error('Failed to fetch finances from backend');
      return await response.json();
    },
  });

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Finanse</h1>

      {isLoading && <div className="text-muted-foreground">Ładowanie danych finansowych...</div>}
      {error && (
        <div className="text-destructive">
          {error instanceof Error ? error.message : "Błąd podczas pobierania finansów."}
        </div>
      )}

      {data && (
        <div className="grid gap-8">
          {/* KPIs */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="text-xs text-muted-foreground">MRR</div>
                <div className="text-xl font-semibold">{formatCurrency(data.kpis.mrr, "PLN")}</div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-xs text-muted-foreground">ARR</div>
                <div className="text-xl font-semibold">{formatCurrency(data.kpis.arr, "PLN")}</div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-xs text-muted-foreground">Wydatki (mies.)</div>
                <div className="text-xl font-semibold">{formatCurrency(data.kpis.expensesMonthly, "PLN")}</div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-xs text-muted-foreground">Zysk (mies.)</div>
                <div className="text-xl font-semibold">{formatCurrency(data.kpis.profitMonthly, "PLN")}</div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-xs text-muted-foreground">Zaległe FV</div>
                <div className="text-xl font-semibold">{data.kpis.invoicesOverdue}</div>
              </div>
            </div>
          </section>

          {/* Invoices */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Faktury</h2>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3">Nr</th>
                    <th className="text-left p-3">Klient</th>
                    <th className="text-left p-3">Wystawiono</th>
                    <th className="text-left p-3">Termin</th>
                    <th className="text-left p-3">Kwota</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.map((inv) => (
                    <tr key={inv.id} className="border-t">
                      <td className="p-3 font-medium">{inv.id}</td>
                      <td className="p-3">{inv.client}</td>
                      <td className="p-3">{new Date(inv.issuedAt).toLocaleDateString("pl-PL")}</td>
                      <td className="p-3">{new Date(inv.dueAt).toLocaleDateString("pl-PL")}</td>
                      <td className="p-3">{formatCurrency(inv.amount, inv.currency)}</td>
                      <td className="p-3"><Badge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Expenses */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Wydatki</h2>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Kategoria</th>
                    <th className="text-left p-3">Kwota</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expenses.map((exp) => (
                    <tr key={exp.id} className="border-t">
                      <td className="p-3 font-medium">{exp.id}</td>
                      <td className="p-3">{exp.category}</td>
                      <td className="p-3">{formatCurrency(exp.amount, exp.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
