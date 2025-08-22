import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { TeamActivity } from "@/components/dashboard/team-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Panel Zarządzania Agencją
          </h1>
          <p className="text-muted-foreground">
            Przegląd aktywności i kluczowych metryk Twojej agencji
          </p>
        </div>

        <div className="grid gap-6">
          {/* Stats Overview */}
          <DashboardStats />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <RecentProjects />
            </div>
            
            {/* Quick Actions - Takes 1 column */}
            <div>
              <QuickActions />
            </div>
          </div>
          
          {/* Team Activity */}
          <TeamActivity />
        </div>
      </main>
    </div>
  );
}