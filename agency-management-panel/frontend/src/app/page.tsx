import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Bell,
  Calendar,
  BarChart3,
  Activity,
  ArrowUp,
  ArrowDown,
  Eye,
  Settings,
  FolderKanban,
  CreditCard
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Zarządzania</h1>
        <p className="text-muted-foreground mt-2">Przegląd kluczowych metryk i wydajności agencji</p>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/clients">
          <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Zarządzanie Klientami</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24 klientów</div>
              <p className="text-xs text-muted-foreground">Zarządzaj bazą klientów</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/projects">
          <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zarządzanie Projektami</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18 projektów</div>
              <p className="text-xs text-muted-foreground">Śledź postęp realizacji</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/finances">
          <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Zarządzanie Finansami</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231 zł</div>
              <p className="text-xs text-muted-foreground">Przychody i wydatki</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktywni Klienci</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              +12% z poprzedniego miesiąca
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Przychody Miesięczne</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231 zł</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              +8% z poprzedniego miesiąca
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projekty w Toku</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              -3 z poprzedniego tygodnia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satysfakcja Klientów</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Wydajność Usług</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Strony WWW</span>
                <div className="flex items-center gap-2">
                  <Progress value={85} className="w-20" />
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sklepy Shopify</span>
                <div className="flex items-center gap-2">
                  <Progress value={72} className="w-20" />
                  <span className="text-sm font-medium">72%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Aplikacje Mobilne</span>
                <div className="flex items-center gap-2">
                  <Progress value={91} className="w-20" />
                  <span className="text-sm font-medium">91%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Prototypy MVP</span>
                <div className="flex items-center gap-2">
                  <Progress value={78} className="w-20" />
                  <span className="text-sm font-medium">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Projektów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Zakończone</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">W trakcie</span>
                <span className="text-sm font-medium">6</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Oczekujące</span>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Opóźnione</span>
                <span className="text-sm font-medium">1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ostatnia Aktywność</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nowy projekt dla klienta ABC Corp</p>
                  <p className="text-xs text-muted-foreground">2 godziny temu</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Zakończono audyt UX dla XYZ Ltd</p>
                  <p className="text-xs text-muted-foreground">5 godzin temu</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Raport miesięczny wygenerowany</p>
                  <p className="text-xs text-muted-foreground">1 dzień temu</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nowa płatność odebrana</p>
                  <p className="text-xs text-muted-foreground">2 dni temu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Powiadomienia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="destructive" className="text-xs">Pilne</Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">Projekt opóźniony</p>
                  <p className="text-xs text-muted-foreground">Client DEF - termin przekroczony o 2 dni</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="text-xs">Info</Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nowa wiadomość</p>
                  <p className="text-xs text-muted-foreground">Klient zapytał o wycenę</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">Zadanie</Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">Spotkanie zespołu</p>
                  <p className="text-xs text-muted-foreground">Jutro o 10:00</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              Zobacz wszystkie
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}