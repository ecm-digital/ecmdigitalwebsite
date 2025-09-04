'use client'

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <h3 className="text-sm font-medium">Projekty</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Aktywne projekty</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <h3 className="text-sm font-medium">Klienci</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Aktywni klienci</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <h3 className="text-sm font-medium">Przychody</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">Ten miesiąc</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <h3 className="text-sm font-medium">Zespół</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Członków zespołu</p>
          </div>
        </div>
      </div>
    </div>
  )
}



