"use client";

import React from "react";
import { FinancialAnalytics } from "@/components/dashboard/financial-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, CreditCard } from "lucide-react";

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

function StatusBadge({ status }: { status: Invoice["status"] }) {
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
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Finanse i Analiza</h1>
        <p className="text-muted-foreground mt-2">Przegląd przychodów, wydatków i efektywności finansowej</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-medium">Generuj Raport</h3>
                <p className="text-sm text-muted-foreground">Miesięczny raport finansowy</p>
              </div>
            </div>
            <Button className="w-full mt-4" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Pobierz PDF
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-medium">Faktury</h3>
                <p className="text-sm text-muted-foreground">Zarządzaj fakturami</p>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm">
              Zobacz wszystkie
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-medium">Budżet</h3>
                <p className="text-sm text-muted-foreground">Planowanie wydatków</p>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm">
              Zarządzaj
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Financial Analytics Component */}
      <FinancialAnalytics />
    </div>
  );
}
