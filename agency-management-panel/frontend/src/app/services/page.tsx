import { AgencyServices } from "@/components/dashboard/agency-services";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Usługi Agencji
          </h1>
          <p className="text-muted-foreground">
            Zarządzaj ofertą usług ECM Digital i monitoruj ich wydajność
          </p>
        </div>

        <AgencyServices />
      </main>
    </div>
  );
}