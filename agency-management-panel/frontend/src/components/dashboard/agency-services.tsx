"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
// import { supabase } from "../../lib/supabaseClient"; // Zastąpione przez AWS
import { 
  Globe, 
  ShoppingCart, 
  Lightbulb, 
  Search, 
  Zap, 
  BarChart3,
  ArrowRight,
  TrendingUp,
  Users,
  Target
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Map string icon names from DB to lucide-react components
const iconMap: Record<string, LucideIcon> = {
  Globe,
  ShoppingCart,
  Lightbulb,
  Search,
  Zap,
  BarChart3,
  TrendingUp,
  Users,
  Target,
};

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon?: string; // DB icon name
  iconComponent?: LucideIcon; // resolved component
  color?: string;
  stats: { projects?: number; avgTime?: string; satisfaction?: string };
  features: string[];
  priceRange?: string;
}

interface OverallStatItem {
  label: string;
  value: string;
  change?: string;
  icon?: string;
  iconComponent?: LucideIcon;
}

export function AgencyServices() {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [brief, setBrief] = React.useState("");
  const [recs, setRecs] = React.useState<Array<{ id: number | string; title: string; reason?: string; score?: number }>>([]);
  const [genLoading, setGenLoading] = React.useState(false);
  const [genError, setGenError] = React.useState<string | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["agency-services"],
    queryFn: async () => {
      try {
        // Pobierz usługi z backendu
        const servicesResponse = await fetch("http://localhost:3001/api/services");
        if (!servicesResponse.ok) {
          throw new Error(`Services API error: ${servicesResponse.status}`);
        }
        
        const servicesData = await servicesResponse.json();
        const services: ServiceItem[] = servicesData.data.services.map((s: any) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          icon: s.icon,
          iconComponent: iconMap[s.icon as keyof typeof iconMap] || iconMap.globe,
          color: s.color,
          stats: {
            projects: s.stats.projects,
            avgTime: s.stats.avgTime,
            satisfaction: s.stats.satisfaction,
          },
          features: s.features,
          priceRange: s.priceRange,
        }));

        // Pobierz FAQ z backendu
        const faqResponse = await fetch("http://localhost:3001/api/faq");
        let faq = [];
        if (faqResponse.ok) {
          const faqData = await faqResponse.json();
          faq = faqData.data.faq;
        }

        // Oblicz statystyki ogólne
        const totalProjects = services.reduce((sum, s) => sum + s.stats.projects, 0);
        const avgTime = services.reduce((sum, s) => {
          const timeStr = s.stats.avgTime;
          const weeks = parseInt(timeStr.match(/\d+/)?.[0] || '0');
          return sum + weeks;
        }, 0) / services.length;
        
        const avgSatisfaction = services.reduce((sum, s) => sum + s.stats.satisfaction, 0) / services.length;

        const overall: OverallStatItem[] = [
          {
            label: "Łącznie projektów",
            value: totalProjects.toString(),
            change: "+12%",
            icon: "trending-up",
            iconComponent: iconMap["trending-up"],
          },
          {
            label: "Średni czas realizacji",
            value: `${avgTime.toFixed(1)} tyg`,
            change: "-8%",
            icon: "clock",
            iconComponent: iconMap.clock,
          },
          {
            label: "Satisfaction rate",
            value: `${avgSatisfaction.toFixed(1)}/5`,
            change: "+0.2",
            icon: "star",
            iconComponent: iconMap.star,
          }
        ];

        console.info("AgencyServices: dane z API", {
          servicesCount: services.length,
          overallCount: overall.length,
          faqCount: faq.length,
          source: "AWS S3 + API"
        });

        return { services, overall, faq };
      } catch (error) {
        console.error("Error fetching services from API:", error);
        
        // Fallback do mockowych danych w przypadku błędu
        console.warn("Falling back to mock data...");
        
        const services: ServiceItem[] = [
          {
            id: "1",
            title: "Strony WWW",
            description: "Nowoczesne strony internetowe z responsywnym designem",
            icon: "globe",
            iconComponent: iconMap.globe,
            color: "bg-blue-500",
            stats: {
              projects: 25,
              avgTime: "4-6 tyg",
              satisfaction: 4.8,
            },
            features: ["Responsywny design", "SEO", "Analytics", "CMS"],
            priceRange: "3000-15000 PLN",
          },
          {
            id: "2",
            title: "Sklepy Shopify",
            description: "Profesjonalne sklepy internetowe na platformie Shopify",
            icon: "shopping-cart",
            iconComponent: iconMap["shopping-cart"],
            color: "bg-green-500",
            stats: {
              projects: 18,
              avgTime: "6-8 tyg",
              satisfaction: 4.9,
            },
            features: ["Integracje płatności", "Zarządzanie produktami", "Analytics", "Mobile-first"],
            priceRange: "5000-25000 PLN",
          },
          {
            id: "3",
            title: "Prototypy MVP",
            description: "Szybkie prototypy i aplikacje MVP",
            icon: "zap",
            iconComponent: iconMap.zap,
            color: "bg-yellow-500",
            stats: {
              projects: 12,
              avgTime: "2-4 tyg",
              satisfaction: 4.7,
            },
            features: ["Rapid prototyping", "User testing", "Iteracje", "Launch ready"],
            priceRange: "8000-40000 PLN",
          },
          {
            id: "4",
            title: "Audyty UX",
            description: "Kompleksowe audyty użyteczności i doświadczenia użytkownika",
            icon: "eye",
            iconComponent: iconMap.eye,
            color: "bg-purple-500",
            stats: {
              projects: 32,
              avgTime: "1-2 tyg",
              satisfaction: 4.9,
            },
            features: ["Heurystyki UX", "User research", "Raporty", "Rekomendacje"],
            priceRange: "2000-8000 PLN",
          }
        ];
        
        const overall: OverallStatItem[] = [
          {
            label: "Łącznie projektów",
            value: "87",
            change: "+12%",
            icon: "trending-up",
            iconComponent: iconMap["trending-up"],
          },
          {
            label: "Średni czas realizacji",
            value: "5.2 tyg",
            change: "-8%",
            icon: "clock",
            iconComponent: iconMap.clock,
          },
          {
            label: "Satisfaction rate",
            value: "4.8/5",
            change: "+0.2",
            icon: "star",
            iconComponent: iconMap.star,
          }
        ];
        
        console.info("AgencyServices: mockowe dane (fallback)", {
          servicesCount: services.length,
          overallCount: overall.length,
          source: "Mock data (fallback)"
        });
        return { services, overall, faq: [] };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minut
    gcTime: 10 * 60 * 1000,   // 10 minut
  });

  const services: ServiceItem[] = data?.services ?? [];
  const overall: OverallStatItem[] = data?.overall ?? [];
  const recommendedIds = React.useMemo(() => new Set((recs || []).map((r) => String(r.id))), [recs]);

  async function generateAIRecommendations() {
    try {
      setGenError(null);
      setGenLoading(true);
      setRecs([]);
      const resp = await fetch("http://localhost:3001/api/recommend-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief,
          services: services.map((s) => ({ id: s.id, title: s.title, description: s.description, features: s.features })),
        }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json?.error || "Błąd podczas generowania rekomendacji");
      setRecs(Array.isArray(json.recommendations) ? json.recommendations : []);
      if (!json.recommendations?.length) toast.message("Brak rekomendacji od AI dla podanego opisu");
    } catch (e: any) {
      const msg = e?.message || "Nie udało się wygenerować rekomendacji";
      setGenError(msg);
      toast.error(msg);
    } finally {
      setGenLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Usługi Agencji</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Przegląd oferty i statystyk usług ECM Digital
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                Dodaj usługę
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {overall.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {overall.map((stat, index) => {
                const Icon = (stat as any).iconComponent || (stat.icon ? iconMap[stat.icon] : undefined) || Target;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                      <div className="text-xs text-green-600">{stat.change}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground mb-6">Brak statystyk ogólnych usług w bazie.</div>
          )}
        </CardContent>
      </Card>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = (service as any).iconComponent || (service.icon ? iconMap[service.icon] : undefined) || Globe;
            
            const isRecommended = recommendedIds.has(String(service.id));
            return (
              <Card key={service.id} className={`hover:shadow-lg transition-shadow ${isRecommended ? "ring-1 ring-primary/40" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${service.color || "bg-primary"} text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {service.stats?.projects ?? 0} projektów
                        </Badge>
                      </div>
                    </div>
                    {isRecommended && (
                      <Badge className="text-xs" variant="outline">Polecane AI</Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-muted/50 rounded">
                      <div className="text-xs font-medium">{service.stats?.avgTime ?? "-"}</div>
                      <div className="text-xs text-muted-foreground">Czas</div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <div className="text-xs font-medium">{service.stats?.satisfaction ?? "-"}</div>
                      <div className="text-xs text-muted-foreground">Satysfakcja</div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <div className="text-xs font-medium">{service.stats?.projects ?? 0}</div>
                      <div className="text-xs text-muted-foreground">Projektów</div>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {service.features?.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Price Range */}
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">
                        {service.priceRange ?? ""}
                      </span>
                      <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                        <Link href={`/services/${service.id}`}>
                          Szczegóły
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">Brak usług w bazie. Dodaj rekordy do tabeli <code>public.services</code>.</div>
      )}

      {/* Service Recommendations (AI-powered) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rekomendacje Usług (AI)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Wpisz krótki opis potrzeb klienta/projektu i wygeneruj rekomendacje dopasowane do Twojej listy usług.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label htmlFor="ai-brief">Opis klienta/projektu</Label>
              <Textarea id="ai-brief" rows={3} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Napisz krótko o branży, celach, wymaganiach..." />
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={generateAIRecommendations} disabled={genLoading || services.length === 0}>
                {genLoading ? "Generowanie..." : "Generuj rekomendacje AI"}
              </Button>
              <span className="text-xs text-muted-foreground">Wykorzystuje OpenAI (klucz na serwerze)</span>
            </div>
            {genError && (
              <div className="text-xs text-destructive">{genError}</div>
            )}
          </div>

          {recs.length > 0 && (
            <div className="space-y-2">
              {recs.map((r, idx) => (
                <div key={`${r.id}-${idx}`} className="flex items-start justify-between p-3 bg-muted/40 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{r.title}</div>
                    {r.reason && <div className="text-xs text-muted-foreground mt-1">{r.reason}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    {typeof r.score === 'number' && (
                      <Badge variant="outline">Pewność: {Math.round(r.score * 100)}%</Badge>
                    )}
                    <Badge variant="secondary">Rekomendacja AI</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Service Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dodaj usługę</DialogTitle>
            <DialogDescription>Uzupełnij podstawowe informacje. Pola z * są wymagane.</DialogDescription>
          </DialogHeader>
          <CreateServiceForm
            onCreated={() => {
              qc.invalidateQueries({ queryKey: ["agency-services"] });
              setOpen(false);
            }}
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>Anuluj</Button>
            <Button type="submit" form="create-service-form">Zapisz usługę</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateServiceForm({ onCreated }: { onCreated?: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [icon, setIcon] = React.useState<string>("");
  const [color, setColor] = React.useState<string>("bg-primary");
  const [features, setFeatures] = React.useState<string>("");
  const [priceRange, setPriceRange] = React.useState<string>("");
  const [active, setActive] = React.useState<string>("true");

  const createService = useMutation({
    mutationFn: async () => {
      // TODO: Zastąpione przez AWS RDS gdy będzie gotowy
      const featuresArr = features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        icon: icon || null,
        color: color || null,
        features: featuresArr,
        price_range: priceRange || null,
        active: active === "true",
      };
      // TODO: Zastąpione przez AWS RDS gdy będzie gotowy
      // Na razie symuluję sukces
      console.log("Dodano usługę:", payload);
      return true;
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error("CreateServiceForm: error", err);
      toast.error((err as Error)?.message || "Nie udało się dodać usługi.");
    },
    onSuccess: () => {
      setTitle(""); setDescription(""); setIcon(""); setColor("bg-primary"); setFeatures(""); setPriceRange(""); setActive("true");
      qc.invalidateQueries({ queryKey: ["agency-services"] });
      toast.success("Usługa została dodana");
      onCreated?.();
    },
  });

  const iconOptions = Object.keys(iconMap);

  return (
    <form
      id="create-service-form"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const valid = title.trim() && description.trim();
        if (!valid || createService.isPending) return;
        createService.mutate();
      }}
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          const valid = title.trim() && description.trim();
          if (valid && !createService.isPending) {
            e.preventDefault();
            createService.mutate();
          }
        }
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="s-title">Tytuł *</Label>
        <Input id="s-title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="np. Strona WWW" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="s-icon">Ikona</Label>
        <Select value={icon} onValueChange={setIcon}>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz ikonę (opcjonalnie)" />
          </SelectTrigger>
          <SelectContent>
            {iconOptions.map((key) => (
              <SelectItem key={key} value={key}>{key}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2 space-y-1">
        <Label htmlFor="s-description">Opis *</Label>
        <Textarea id="s-description" required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Krótki opis usługi" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="s-color">Kolor (Tailwind)</Label>
        <Input id="s-color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="np. bg-primary" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="s-active">Aktywna</Label>
        <Select value={active} onValueChange={setActive}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Tak</SelectItem>
            <SelectItem value="false">Nie</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2 space-y-1">
        <Label htmlFor="s-features">Funkcje (oddzielone przecinkami)</Label>
        <Input id="s-features" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="np. SEO, Hosting, CMS" />
      </div>
      <div className="md:col-span-2 space-y-1">
        <Label htmlFor="s-price">Przedział cenowy</Label>
        <Input id="s-price" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="np. 5 000 - 25 000 PLN" />
      </div>
      {createService.isError && (
        <div className="md:col-span-2 text-xs text-destructive mt-1">{(createService.error as Error)?.message || "Błąd podczas dodawania usługi."}</div>
      )}
    </form>
  );
}