"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
// Removed supabase import - using mock functions instead

interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  description: string;
}

type CreateTaskFormProps = { projectId: string; onCreated?: () => void };
function CreateTaskForm({ projectId, onCreated }: CreateTaskFormProps) {
  const qc = useQueryClient();
  const [title, setTitle] = React.useState("");
  const [assignee, setAssignee] = React.useState("");
  const [dueAt, setDueAt] = React.useState("");
  const [status, setStatus] = React.useState<string>("Todo");

  const createTask = useMutation({
    mutationFn: async () => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const payload = {
        project_id: Number(projectId),
        title,
        assignee,
        status,
        due_at: dueAt || null,
      };
      const { data, error } = await supabase
        .from("tasks")
        .insert(payload)
        .select("id,title,assignee,status,due_at")
        .single();
      if (error) throw new Error(`Nie udało się utworzyć zadania (Supabase): ${error.message}`);
      return { id: data!.id, title: data!.title, assignee: data!.assignee, status: data!.status, dueAt: data!.due_at || undefined } as Task;
    },
    onSuccess: () => {
      setTitle("");
      setAssignee("");
      setDueAt("");
      setStatus("Todo");
      qc.invalidateQueries({ queryKey: ["project", projectId, "tasks"] });
      onCreated?.();
    },
  });

  return (
    <form
      className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-2 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title || !assignee) return;
        createTask.mutate();
      }}
    >
      <input className="border rounded px-2 py-1 bg-background" placeholder="Tytuł zadania" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="border rounded px-2 py-1 bg-background" placeholder="Osoba" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
      <input className="border rounded px-2 py-1 bg-background" type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
      <select className="border rounded px-2 py-1 bg-background" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <button type="submit" className="border rounded px-3 py-1 bg-primary text-primary-foreground disabled:opacity-50" disabled={createTask.isPending}>
        Dodaj zadanie
      </button>
    </form>
  );
}

type CreateMilestoneFormProps = { projectId: string; onCreated?: () => void };
function CreateMilestoneForm({ projectId, onCreated }: CreateMilestoneFormProps) {
  const qc = useQueryClient();
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState("");
  const [status, setStatus] = React.useState<string>("Planned");

  const createMs = useMutation({
    mutationFn: async () => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const payload = { project_id: Number(projectId), name, date, status };
      const { data, error } = await supabase
        .from("milestones")
        .insert(payload)
        .select("id,name,date,status")
        .single();
      if (error) throw new Error(`Nie udało się utworzyć kamienia milowego (Supabase): ${error.message}`);
      return data as Milestone;
    },
    onSuccess: () => {
      setName("");
      setDate("");
      setStatus("Planned");
      qc.invalidateQueries({ queryKey: ["project", projectId, "milestones"] });
      onCreated?.();
    },
  });

  return (
    <form
      className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name || !date) return;
        createMs.mutate();
      }}
    >
      <input className="border rounded px-2 py-1 bg-background" placeholder="Nazwa" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="border rounded px-2 py-1 bg-background" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <select className="border rounded px-2 py-1 bg-background" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Planned">Planned</option>
        <option value="On Track">On Track</option>
        <option value="At Risk">At Risk</option>
        <option value="Done">Done</option>
      </select>
      <button type="submit" className="border rounded px-3 py-1 bg-primary text-primary-foreground disabled:opacity-50" disabled={createMs.isPending}>
        Dodaj kamień
      </button>
    </form>
  );
}

interface Task {
  id: string;
  title: string;
  assignee: string;
  status: "Todo" | "In Progress" | "Done" | string;
  dueAt?: string;
}

interface Milestone {
  id: string;
  name: string;
  date: string;
  status: "Planned" | "On Track" | "At Risk" | "Done" | string;
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const qc = useQueryClient();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["project", id],
    enabled: !!id,
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const { data, error } = await supabase
        .from("projects")
        .select("id,name,client,status,description")
        .eq("id", Number(id))
        .single();
      if (error) throw new Error(`Błąd Supabase (project): ${error.message}`);
      return data as Project;
    },
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["project", id, "tasks"],
    enabled: !!id,
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const { data, error } = await supabase
        .from("tasks")
        .select("id,title,assignee,status,due_at")
        .eq("project_id", Number(id))
        .order("due_at", { ascending: true, nullsFirst: true });
      if (error) throw new Error(`Błąd Supabase (tasks): ${error.message}`);
      return (data || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        assignee: t.assignee,
        status: t.status,
        dueAt: t.due_at || undefined,
      })) as Task[];
    },
  });

  const { data: milestones = [] } = useQuery<Milestone[]>({
    queryKey: ["project", id, "milestones"],
    enabled: !!id,
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const { data, error } = await supabase
        .from("milestones")
        .select("id,name,date,status")
        .eq("project_id", Number(id))
        .order("date", { ascending: true });
      if (error) throw new Error(`Błąd Supabase (milestones): ${error.message}`);
      return (data || []) as Milestone[];
    },
  });

  // Quick status update for tasks (optimistic)
  const statusOptions = ["Todo", "In Progress", "Done"] as const;
  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const { data, error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", taskId)
        .select("id,title,assignee,status,due_at")
        .single();
      if (error) throw new Error(`Nie udało się zaktualizować statusu zadania (Supabase): ${error.message}`);
      return { id: data!.id, title: data!.title, assignee: data!.assignee, status: data!.status, dueAt: data!.due_at || undefined } as Task;
    },
    onMutate: async ({ taskId, status }) => {
      const key = ["project", id, "tasks"] as const;
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<Task[]>(key);
      if (previous) {
        qc.setQueryData<Task[]>(key, previous.map(t => (t.id === taskId ? { ...t, status } : t)));
      }
      return { previous } as { previous?: Task[] };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(["project", id, "tasks"], ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["project", id, "tasks"] });
    },
  });
  
  // Inline edit/delete state for tasks
  const [editTaskId, setEditTaskId] = React.useState<string | null>(null);
  const [editTask, setEditTask] = React.useState<Partial<Task>>({});

  const patchTask = useMutation({
    mutationFn: async ({ taskId, data }: { taskId: string; data: Partial<Task> }) => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const payload: any = { ...data };
      if (payload.dueAt !== undefined) {
        payload.due_at = payload.dueAt || null;
        delete payload.dueAt;
      }
      const { data: updated, error } = await supabase
        .from("tasks")
        .update(payload)
        .eq("id", taskId)
        .select("id,title,assignee,status,due_at")
        .single();
      if (error) throw new Error(`Nie udało się zaktualizować zadania (Supabase): ${error.message}`);
      return { id: updated!.id, title: updated!.title, assignee: updated!.assignee, status: updated!.status, dueAt: updated!.due_at || undefined } as Task;
    },
    onMutate: async ({ taskId, data }) => {
      const key = ["project", id, "tasks"] as const;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Task[]>(key);
      if (prev) qc.setQueryData<Task[]>(key, prev.map(t => (t.id === taskId ? { ...t, ...data } as Task : t)));
      return { prev } as { prev?: Task[] };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["project", id, "tasks"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["project", id, "tasks"] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);
      if (error) throw new Error(`Nie udało się usunąć zadania (Supabase): ${error.message}`);
      return taskId;
    },
    onMutate: async (taskId) => {
      const key = ["project", id, "tasks"] as const;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Task[]>(key);
      if (prev) qc.setQueryData<Task[]>(key, prev.filter(t => t.id !== taskId));
      return { prev } as { prev?: Task[] };
    },
    onError: (_e, _taskId, ctx) => {
      if (ctx?.prev) qc.setQueryData(["project", id, "tasks"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["project", id, "tasks"] });
    },
  });

  // Inline edit/delete state for milestones
  const [editMsId, setEditMsId] = React.useState<string | null>(null);
  const [editMs, setEditMs] = React.useState<Partial<Milestone>>({});

  const patchMs = useMutation({
    mutationFn: async ({ milestoneId, data }: { milestoneId: string; data: Partial<Milestone> }) => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const { data: updated, error } = await supabase
        .from("milestones")
        .update(data)
        .eq("id", milestoneId)
        .select("id,name,date,status")
        .single();
      if (error) throw new Error(`Nie udało się zaktualizować kamienia milowego (Supabase): ${error.message}`);
      return updated as Milestone;
    },
    onMutate: async ({ milestoneId, data }) => {
      const key = ["project", id, "milestones"] as const;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Milestone[]>(key);
      if (prev) qc.setQueryData<Milestone[]>(key, prev.map(m => (m.id === milestoneId ? { ...m, ...data } as Milestone : m)));
      return { prev } as { prev?: Milestone[] };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["project", id, "milestones"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["project", id, "milestones"] });
    },
  });

  const deleteMs = useMutation({
    mutationFn: async (milestoneId: string) => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const { error } = await supabase.from("milestones").delete().eq("id", milestoneId);
      if (error) throw new Error(`Nie udało się usunąć kamienia milowego (Supabase): ${error.message}`);
      return milestoneId;
    },
    onMutate: async (milestoneId) => {
      const key = ["project", id, "milestones"] as const;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Milestone[]>(key);
      if (prev) qc.setQueryData<Milestone[]>(key, prev.filter(m => m.id !== milestoneId));
      return { prev } as { prev?: Milestone[] };
    },
    onError: (_e, _id2, ctx) => {
      if (ctx?.prev) qc.setQueryData(["project", id, "milestones"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["project", id, "milestones"] });
    },
  });

  // Sorting state
  const [taskSortBy, setTaskSortBy] = React.useState<"dueAt" | "status" | "assignee">("dueAt");
  const [taskSortOrder, setTaskSortOrder] = React.useState<"asc" | "desc">("asc");
  const [msSortBy, setMsSortBy] = React.useState<"date" | "status" | "name">("date");
  const [msSortOrder, setMsSortOrder] = React.useState<"asc" | "desc">("asc");

  // Filters
  const [taskStatusFilter, setTaskStatusFilter] = React.useState<string>("all");
  const [taskAssigneeFilter, setTaskAssigneeFilter] = React.useState<string>("");

  const sortedTasks = React.useMemo(() => {
    const arr = [...(tasks || [])]
      .filter(t => (taskStatusFilter === "all" ? true : t.status === taskStatusFilter))
      .filter(t => (taskAssigneeFilter.trim() ? t.assignee.toLowerCase().includes(taskAssigneeFilter.trim().toLowerCase()) : true));
    arr.sort((a, b) => {
      const dir = taskSortOrder === "asc" ? 1 : -1;
      const av = a[taskSortBy] || "";
      const bv = b[taskSortBy] || "";
      if (taskSortBy === "dueAt") {
        return (new Date(av as string).getTime() - new Date(bv as string).getTime()) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
    return arr;
  }, [tasks, taskStatusFilter, taskAssigneeFilter, taskSortBy, taskSortOrder]);

  const sortedMilestones = React.useMemo(() => {
    const arr = [...(milestones || [])];
    arr.sort((a, b) => {
      const dir = msSortOrder === "asc" ? 1 : -1;
      const av = a[msSortBy];
      const bv = b[msSortBy];
      if (msSortBy === "date") {
        return (new Date(av).getTime() - new Date(bv).getTime()) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
    return arr;
  }, [milestones, msSortBy, msSortOrder]);

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Wróć
        </button>
        <Link href="/projects" className="text-sm text-primary hover:underline">
          Wszystkie projekty
        </Link>
      </div>

      {isLoading && <div className="text-muted-foreground">Ładowanie projektu...</div>}
      {error && (
        <div className="text-destructive">
          {error instanceof Error ? error.message : "Błąd podczas pobierania projektu."}
        </div>
      )}

      {project && (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <div className="text-sm text-muted-foreground mt-1">
                Klient: <span className="font-medium">{project.client}</span>
              </div>
            </div>
            <div className="text-xs">
              <span className="inline-block px-3 py-1 rounded bg-primary/10 text-primary font-semibold">
                {project.status}
              </span>
            </div>
          </div>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-2">Opis</h2>
            <p className="text-sm text-foreground">{project.description}</p>
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-2">Szczegóły projektu</h2>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <span className="text-foreground font-medium">ID:</span> {project.id}
              </li>
              <li>
                <span className="text-foreground font-medium">Status:</span> {project.status}
              </li>
              <li>
                <span className="text-foreground font-medium">Klient:</span> {project.client}
              </li>
            </ul>
          </section>

          <section className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Zadania</h2>
              <div className="flex items-center gap-2 text-sm">
                <label className="text-muted-foreground">Sortuj:</label>
                <select className="border rounded px-2 py-1 bg-background" value={taskSortBy} onChange={(e) => setTaskSortBy(e.target.value as any)}>
                  <option value="dueAt">Termin</option>
                  <option value="status">Status</option>
                  <option value="assignee">Osoba</option>
                </select>
                <select className="border rounded px-2 py-1 bg-background" value={taskSortOrder} onChange={(e) => setTaskSortOrder(e.target.value as any)}>
                  <option value="asc">Rosnąco</option>
                  <option value="desc">Malejąco</option>
                </select>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <label className="text-muted-foreground">Filtr statusu:</label>
              <select className="border rounded px-2 py-1 bg-background" value={taskStatusFilter} onChange={(e) => setTaskStatusFilter(e.target.value)}>
                <option value="all">Wszystkie</option>
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <label className="text-muted-foreground">Filtr osoby:</label>
              <input
                className="border rounded px-2 py-1 bg-background"
                placeholder="np. Marta"
                value={taskAssigneeFilter}
                onChange={(e) => setTaskAssigneeFilter(e.target.value)}
              />
            </div>

            {/* Create Task */}
            <CreateTaskForm projectId={String(id)} onCreated={() => qc.invalidateQueries({ queryKey: ["project", id, "tasks"] })} />
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Tytuł</th>
                    <th className="text-left p-3">Osoba</th>
                    <th className="text-left p-3">Termin</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-right p-3">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTasks.map((t) => {
                    const isEditing = editTaskId === t.id;
                    return (
                      <tr key={t.id} className="border-t">
                        <td className="p-3 font-medium">{t.id}</td>
                        <td className="p-3">
                          {isEditing ? (
                            <input className="border rounded px-2 py-1 bg-background w-full" value={editTask.title ?? t.title} onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} />
                          ) : (
                            t.title
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <input className="border rounded px-2 py-1 bg-background w-full" value={editTask.assignee ?? t.assignee} onChange={(e) => setEditTask({ ...editTask, assignee: e.target.value })} />
                          ) : (
                            t.assignee
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <input className="border rounded px-2 py-1 bg-background" type="date" value={(editTask.dueAt ?? t.dueAt ?? "").toString().slice(0,10)} onChange={(e) => setEditTask({ ...editTask, dueAt: e.target.value })} />
                          ) : (
                            t.dueAt ? new Date(t.dueAt).toLocaleDateString("pl-PL") : "—"
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <select className="border rounded px-2 py-1 text-xs bg-background" value={editTask.status ?? t.status} onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}>
                              {statusOptions.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">{t.status}</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {!isEditing && (
                            <>
                              <select
                                className="border rounded px-2 py-1 text-xs bg-background"
                                value={t.status}
                                onChange={(e) => updateTaskStatus.mutate({ taskId: t.id, status: e.target.value })}
                              >
                                {statusOptions.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              <button className="text-xs text-primary hover:underline" onClick={() => { setEditTaskId(t.id); setEditTask({}); }}>Edytuj</button>
                              <button className="text-xs text-destructive hover:underline" onClick={() => deleteTask.mutate(t.id)}>Usuń</button>
                            </>
                          )}
                          {isEditing && (
                            <>
                              <button
                                className="text-xs text-primary hover:underline"
                                onClick={() => { patchTask.mutate({ taskId: t.id, data: editTask }); setEditTaskId(null); setEditTask({}); }}
                              >Zapisz</button>
                              <button className="text-xs text-muted-foreground hover:underline" onClick={() => { setEditTaskId(null); setEditTask({}); }}>Anuluj</button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Kamienie milowe</h2>
              <div className="flex items-center gap-2 text-sm">
                <label className="text-muted-foreground">Sortuj:</label>
                <select className="border rounded px-2 py-1 bg-background" value={msSortBy} onChange={(e) => setMsSortBy(e.target.value as any)}>
                  <option value="date">Data</option>
                  <option value="status">Status</option>
                  <option value="name">Nazwa</option>
                </select>
                <select className="border rounded px-2 py-1 bg-background" value={msSortOrder} onChange={(e) => setMsSortOrder(e.target.value as any)}>
                  <option value="asc">Rosnąco</option>
                  <option value="desc">Malejąco</option>
                </select>
              </div>
            </div>

            {/* Create Milestone */}
            <CreateMilestoneForm projectId={String(id)} onCreated={() => qc.invalidateQueries({ queryKey: ["project", id, "milestones"] })} />
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Nazwa</th>
                    <th className="text-left p-3">Data</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-right p-3">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMilestones.map((m) => {
                    const isEditing = editMsId === m.id;
                    return (
                      <tr key={m.id} className="border-t">
                        <td className="p-3 font-medium">{m.id}</td>
                        <td className="p-3">
                          {isEditing ? (
                            <input className="border rounded px-2 py-1 bg-background w-full" value={editMs.name ?? m.name} onChange={(e) => setEditMs({ ...editMs, name: e.target.value })} />
                          ) : (
                            m.name
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <input className="border rounded px-2 py-1 bg-background" type="date" value={(editMs.date ?? m.date).slice(0,10)} onChange={(e) => setEditMs({ ...editMs, date: e.target.value })} />
                          ) : (
                            new Date(m.date).toLocaleDateString("pl-PL")
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <select className="border rounded px-2 py-1 text-xs bg-background" value={editMs.status ?? m.status} onChange={(e) => setEditMs({ ...editMs, status: e.target.value })}>
                              <option>Planned</option>
                              <option>On Track</option>
                              <option>At Risk</option>
                              <option>Done</option>
                            </select>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">{m.status}</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {!isEditing && (
                            <>
                              <button className="text-xs text-primary hover:underline" onClick={() => { setEditMsId(m.id); setEditMs({}); }}>Edytuj</button>
                              <button className="text-xs text-destructive hover:underline" onClick={() => deleteMs.mutate(m.id)}>Usuń</button>
                            </>
                          )}
                          {isEditing && (
                            <>
                              <button className="text-xs text-primary hover:underline" onClick={() => { patchMs.mutate({ milestoneId: m.id, data: editMs }); setEditMsId(null); setEditMs({}); }}>Zapisz</button>
                              <button className="text-xs text-muted-foreground hover:underline" onClick={() => { setEditMsId(null); setEditMs({}); }}>Anuluj</button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
