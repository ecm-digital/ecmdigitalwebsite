"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ClientRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  company: string;
  role: string;
  status: string;
  registration_date: string;
  lastLoginAt: string | null;
}

interface ProjectRow {
  id: string;
  name: string;
  status: string;
  client: string;
  progress: number;
  dueDate?: string;
  budget?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ClientsPage() {
  const [clients, setClients] = React.useState<ClientRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [projectsOpen, setProjectsOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState<ClientRow | null>(null);
  const [projects, setProjects] = React.useState<ProjectRow[]>([]);
  const [projectsLoading, setProjectsLoading] = React.useState(false);

  React.useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mock data instead of API call
        const mockClients: ClientRow[] = [
          {
            id: '1',
            email: 'john@techcorp.com',
            firstName: 'John',
            lastName: 'Smith',
            name: 'John Smith',
            company: 'TechCorp',
            role: 'client',
            status: 'Zweryfikowany',
            registration_date: '2025-01-15T10:30:00Z',
            lastLoginAt: '2025-01-20T14:20:00Z'
          },
          {
            id: '2',
            email: 'sarah@startupxyz.com',
            firstName: 'Sarah',
            lastName: 'Johnson',
            name: 'Sarah Johnson',
            company: 'StartupXYZ',
            role: 'client',
            status: 'Zweryfikowany',
            registration_date: '2025-01-18T09:15:00Z',
            lastLoginAt: '2025-01-21T11:45:00Z'
          },
          {
            id: '3',
            email: 'mike@fashionstore.com',
            firstName: 'Mike',
            lastName: 'Brown',
            name: 'Mike Brown',
            company: 'FashionStore',
            role: 'client',
            status: 'Niezweryfikowany',
            registration_date: '2025-01-22T16:00:00Z',
            lastLoginAt: null
          }
        ];
        setClients(mockClients);
      } catch (e: any) {
        setError(e?.message || 'Błąd pobierania klientów');
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    loadClients();
  }, []);

  const openProjects = async (client: ClientRow) => {
    setSelectedClient(client);
    setProjectsOpen(true);
    setProjects([]);
    setProjectsLoading(true);
    try {
      // Mock projects data
      const mockProjects: ProjectRow[] = [
        {
          id: '1',
          name: 'E-commerce Platform',
          status: 'In Progress',
          client: client.email,
          progress: 75,
          dueDate: '2025-09-15',
          budget: 45000,
          description: 'Modern e-commerce platform with payment integration'
        },
        {
          id: '2',
          name: 'Mobile App Development',
          status: 'Completed',
          client: client.email,
          progress: 100,
          dueDate: '2025-08-30',
          budget: 32000,
          description: 'Cross-platform mobile app for task management'
        }
      ];
      setProjects(mockProjects);
    } catch (e) {
      // Keep modal open, but show empty state
      console.error('Błąd pobierania projektów klienta:', e);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Zarządzanie Klientami</h1>
        <p className="text-muted-foreground mt-2">Analiza klientów i ich projekty</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liczba Klientów</CardTitle>
            <Badge variant="secondary">{clients.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">Łącznie</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zweryfikowani</CardTitle>
            <Badge variant="outline">{clients.filter(c => c.status === 'Zweryfikowany').length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.filter(c => c.status === 'Zweryfikowany').length}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niezweryfikowani</CardTitle>
            <Badge variant="default">{clients.filter(c => c.status !== 'Zweryfikowany').length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.filter(c => c.status !== 'Zweryfikowany').length}</div>
            <p className="text-xs text-muted-foreground">Do follow-up</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ostatnie logowania</CardTitle>
            <Badge variant="secondary">{clients.filter(c => !!c.lastLoginAt).length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.filter(c => !!c.lastLoginAt).length}</div>
            <p className="text-xs text-muted-foreground">Z aktywnością</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista klientów</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Ładowanie...</div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">{error}</div>
          ) : clients.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">Brak klientów</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imię</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nazwisko</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firma</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a href={`mailto:${c.email}`} className="text-blue-600 hover:text-blue-800">{c.email}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.firstName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Button size="sm" onClick={() => openProjects(c)}>Projekty</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects Modal */}
      <Dialog open={projectsOpen} onOpenChange={setProjectsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Projekty {selectedClient ? `— ${selectedClient.name || selectedClient.email}` : ''}
            </DialogTitle>
          </DialogHeader>

          {projectsLoading ? (
            <div className="py-8 text-center text-muted-foreground">Ładowanie projektów...</div>
          ) : projects.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Brak projektów</div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">Status: {p.status}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Budżet: {p.budget ?? 0} zł</div>
                  </div>
                  {p.description && (
                    <div className="text-sm mt-2 text-slate-600">{p.description}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}