export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: serviceId } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Szczegóły usługi</h1>
          <p className="text-muted-foreground mb-6">ID usługi: {serviceId}</p>
          <p className="text-sm text-muted-foreground">
            Dynamiczna trasa działa! Teraz możesz dodać pełną funkcjonalność.
          </p>
        </div>
      </div>
    </div>
  );
}
