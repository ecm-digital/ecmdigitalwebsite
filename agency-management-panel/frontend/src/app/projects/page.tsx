"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  description: string;
}

export default function ProjectsPage() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(null);
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const { data, error } = await supabase
        .from("projects")
        .select("id,name,client,status,description")
        .order("id", { ascending: false });
      if (error) throw new Error(`Błąd Supabase (projects): ${error.message}`);
      return (data || []) as Project[];
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: number) => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw new Error(`Nie udało się usunąć projektu (Supabase): ${error.message}`);
      return id;
    },
    onMutate: async (id) => {
      const key = ["projects"] as const;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Project[]>(key);
      if (prev) qc.setQueryData<Project[]>(key, prev.filter(p => p.id !== id));
      return { prev } as { prev?: Project[] };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["projects"], ctx.prev);
      toast.error("Nie udało się usunąć projektu");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
    onSuccess: () => {
      toast.success("Projekt został usunięty");
    }
  });

  // Inline edit state for projects
  const [editProjectId, setEditProjectId] = React.useState<number | null>(null);
  const [editProject, setEditProject] = React.useState<Partial<Project>>({});

  const patchProject = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Project> }) => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const { data: updated, error } = await supabase
        .from("projects")
        .update({
          name: data.name,
          client: data.client,
          status: data.status,
          description: data.description,
        })
        .eq("id", id)
        .select("id,name,client,status,description")
        .single();
      if (error) throw new Error(`Nie udało się zaktualizować projektu (Supabase): ${error.message}`);
      return updated as Project;
    },
    onMutate: async ({ id, data }) => {
      const key = ["projects"] as const;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Project[]>(key);
      if (prev) {
        qc.setQueryData<Project[]>(key, prev.map(p => (p.id === id ? { ...p, ...data } as Project : p)));
      }
      return { prev } as { prev?: Project[] };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["projects"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
    onSuccess: () => {
      setEditProjectId(null);
      setEditProject({});
    }
  });

  return (
    <main className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Projekty</h1>
          <button
            type="button"
            className="border rounded px-3 py-1 bg-primary text-primary-foreground"
            onClick={() => setShowCreate(true)}
          >
            Dodaj projekt
          </button>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Dodaj projekt</DialogTitle>
              <DialogDescription>
                Uzupełnij podstawowe informacje. Pola oznaczone gwiazdką są wymagane.
              </DialogDescription>
            </DialogHeader>
            <CreateProjectForm
              onCreated={() => {
                qc.invalidateQueries({ queryKey: ["projects"] });
                setShowCreate(false);
              }}
            />
            <DialogFooter>
              <Button variant="secondary" onClick={() => setShowCreate(false)}>Anuluj</Button>
              {/* Submit button is inside the form via form attribute */}
              <Button type="submit" form="create-project-form">Zapisz projekt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Confirm delete dialog */}
        <Dialog open={confirmOpen} onOpenChange={(o) => { setConfirmOpen(o); if (!o) setProjectToDelete(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Usunąć projekt?</DialogTitle>
              <DialogDescription>
                {projectToDelete ? `Projekt "${projectToDelete.name}" zostanie trwale usunięty.` : "Projekt zostanie trwale usunięty."}
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm text-muted-foreground">
              Tej operacji nie można cofnąć.
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => { setConfirmOpen(false); setProjectToDelete(null); }}>Anuluj</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (projectToDelete) {
                    deleteProject.mutate(projectToDelete.id);
                  }
                  setConfirmOpen(false);
                  setProjectToDelete(null);
                }}
              >Usuń</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {isLoading && <div className="text-muted-foreground">Ładowanie projektów...</div>}
        {error && (
          <div className="text-destructive">
            {error instanceof Error ? error.message : "Błąd podczas pobierania projektów."}
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects && projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border bg-card p-6 shadow hover:shadow-lg transition-all"
            >
              {editProjectId === project.id ? (
                <div className="space-y-2">
                  <input
                    className="border rounded px-2 py-1 bg-background w-full"
                    placeholder="Nazwa projektu"
                    value={editProject.name ?? project.name}
                    onChange={(e) => setEditProject(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                    className="border rounded px-2 py-1 bg-background w-full"
                    placeholder="Klient"
                    value={editProject.client ?? project.client}
                    onChange={(e) => setEditProject(prev => ({ ...prev, client: e.target.value }))}
                  />
                  <select
                    className="border rounded px-2 py-1 bg-background w-full"
                    value={editProject.status ?? project.status}
                    onChange={(e) => setEditProject(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option>Aktywny</option>
                    <option>Wdrożenie</option>
                    <option>Zakończony</option>
                  </select>
                  <input
                    className="border rounded px-2 py-1 bg-background w-full"
                    placeholder="Opis"
                    value={editProject.description ?? project.description}
                    onChange={(e) => setEditProject(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="space-x-3">
                      <button
                        onClick={() => patchProject.mutate({ id: project.id, data: {
                          name: editProject.name ?? project.name,
                          client: editProject.client ?? project.client,
                          status: editProject.status ?? project.status,
                          description: editProject.description ?? project.description,
                        } })}
                        className="text-primary text-sm hover:underline"
                      >Zapisz</button>
                      <button
                        onClick={() => { setEditProjectId(null); setEditProject({}); }}
                        className="text-muted-foreground text-sm hover:underline"
                      >Anuluj</button>
                    </div>
                    <button
                      onClick={() => { setProjectToDelete(project); setConfirmOpen(true); }}
                      className="text-destructive text-sm hover:underline"
                    >Usuń</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-semibold text-lg mb-2">{project.name}</h2>
                  <div className="text-sm text-muted-foreground mb-1">
                    Klient: <span className="font-medium">{project.client}</span>
                  </div>
                  <div className="text-xs mb-2">
                    Status: <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary font-semibold">{project.status}</span>
                  </div>
                  <p className="text-sm text-foreground mb-2">{project.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="space-x-3">
                      <Link href={`/projects/${project.id}`} className="text-primary hover:underline text-sm font-medium">Szczegóły</Link>
                      <button
                        onClick={() => { setEditProjectId(project.id); setEditProject({ name: project.name, client: project.client, status: project.status, description: project.description }); }}
                        className="text-sm hover:underline"
                      >Edytuj</button>
                    </div>
                    <button
                      onClick={() => { setProjectToDelete(project); setConfirmOpen(true); }}
                      className="text-destructive text-sm hover:underline"
                    >Usuń</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
    </main>
  );
}

function CreateProjectForm({ onCreated }: { onCreated?: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = React.useState("");
  const [client, setClient] = React.useState("");
  const [status, setStatus] = React.useState("Aktywny");
  const [description, setDescription] = React.useState("");

  const createProject = useMutation({
    mutationFn: async () => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const payload = {
        name: name.trim(),
        client: client.trim(),
        status: status.trim(),
        description: description.trim(),
      };
      // eslint-disable-next-line no-console
      console.info("CreateProjectForm: submitting payload", payload);
      const { data, error } = await supabase
        .from("projects")
        .insert(payload)
        .select("id,name,client,status,description")
        .single();
      if (error) throw new Error(`Błąd tworzenia projektu (Supabase): ${error.message}`);
      return data as Project;
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error("CreateProjectForm: mutation error", err);
      toast.error((err as Error)?.message || "Nie udało się utworzyć projektu.");
    },
    onSuccess: () => {
      setName(""); setClient(""); setStatus("Aktywny"); setDescription("");
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projekt został utworzony");
      onCreated?.();
    }
  });

  return (
    <form
      id="create-project-form"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const valid = name.trim() && client.trim() && status.trim() && description.trim();
        // eslint-disable-next-line no-console
        console.info("CreateProjectForm: submit", { valid, name, client, status, description });
        if (!valid || createProject.isPending) return;
        createProject.mutate();
      }}
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          const valid = name.trim() && client.trim() && status.trim() && description.trim();
          if (valid && !createProject.isPending) {
            e.preventDefault();
            createProject.mutate();
          }
        }
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="name">Nazwa projektu *</Label>
        <Input id="name" required placeholder="Nazwa projektu" value={name} onChange={(e) => setName(e.target.value)} />
        <p className="text-xs text-muted-foreground">Krótka, rozpoznawalna nazwa.</p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="client">Klient *</Label>
        <Input id="client" required placeholder="Klient" value={client} onChange={(e) => setClient(e.target.value)} />
        <p className="text-xs text-muted-foreground">Nazwa firmy lub osoby.</p>
      </div>
      <div className="space-y-1">
        <Label>Status *</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Aktywny">Aktywny</SelectItem>
            <SelectItem value="Wdrożenie">Wdrożenie</SelectItem>
            <SelectItem value="Zakończony">Zakończony</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="description">Opis *</Label>
        <Textarea id="description" required placeholder="Krótki opis zakresu i celu projektu" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        <p className="text-xs text-muted-foreground">Dodaj kontekst dla zespołu i klienta.</p>
      </div>
      <div className="md:col-span-2 hidden" aria-hidden />
      {createProject.isError && (
        <div className="md:col-span-2 text-xs text-destructive mt-1">{(createProject.error as Error)?.message || "Błąd podczas tworzenia projektu."}</div>
      )}
    </form>
  );
}
