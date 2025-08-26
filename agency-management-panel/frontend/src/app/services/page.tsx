"use client";

import { AgencyServices } from "@/components/dashboard/agency-services";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <section className="mb-8 rounded-2xl border border-border/40 bg-secondary/60 p-6 backdrop-blur-xl supports-[backdrop-filter]:bg-secondary/50 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Usługi Agencji
          </h1>
          <p className="text-muted-foreground">
            Zarządzaj ofertą usług ECM Digital i monitoruj ich wydajność
          </p>
        </section>

        <AgencyServices />
      </main>
    </div>
  );
}