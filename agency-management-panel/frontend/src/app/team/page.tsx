"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Removed supabase import - using backend API instead
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
}

export default function TeamPage() {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const { data: team, isLoading, error } = useQuery<TeamMember[]>({
    queryKey: ["team"],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/team');
      if (!response.ok) throw new Error('Failed to fetch team from backend');
      return await response.json();
    },
  });

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Zespół</h1>
        <Button size="sm" onClick={() => setOpen(true)}>Dodaj członka</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Dodaj członka zespołu</DialogTitle>
            <DialogDescription>Podaj imię i nazwisko, rolę i (opcjonalnie) bio.</DialogDescription>
          </DialogHeader>
          <CreateTeamForm onCreated={() => { qc.invalidateQueries({ queryKey: ["team"] }); setOpen(false); }} />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>Anuluj</Button>
            <Button type="submit" form="create-team-form">Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading && (
        <div className="text-muted-foreground">Ładowanie zespołu...</div>
      )}
      {error && (
        <div className="text-destructive">
          {error instanceof Error
            ? error.message
            : "Błąd podczas pobierania zespołu."}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team &&
          team.map((member) => (
            <div
              key={member.id}
              className="rounded-lg border bg-card p-6 shadow hover:shadow-lg transition-all flex flex-col"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold text-lg">{member.name}</div>
                  <div className="text-xs text-primary font-semibold">
                    {member.role}
                  </div>
                </div>
              </div>
              {member.bio && (
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              )}
            </div>
          ))}
      </div>
    </main>
  );
}

function CreateTeamForm({ onCreated }: { onCreated?: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [bio, setBio] = React.useState("");

  const createMember = useMutation({
    mutationFn: async () => {
      // Using mock create - backend doesn't support POST yet
      console.log('Mock create team member:', { name, role, bio });
      return true;
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error("CreateTeamForm: error", err);
      toast.error((err as Error)?.message || "Nie udało się dodać członka.");
    },
    onSuccess: () => {
      setName(""); setRole(""); setBio("");
      qc.invalidateQueries({ queryKey: ["team"] });
      toast.success("Dodano członka zespołu");
      onCreated?.();
    }
  });

  return (
    <form
      id="create-team-form"
      className="grid grid-cols-1 gap-4 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const valid = name.trim() && role.trim();
        if (!valid || createMember.isPending) return;
        createMember.mutate();
      }}
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          const valid = name.trim() && role.trim();
          if (valid && !createMember.isPending) {
            e.preventDefault();
            createMember.mutate();
          }
        }
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="t-name">Imię i nazwisko *</Label>
        <Input id="t-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jan Kowalski" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="t-role">Rola *</Label>
        <Input id="t-role" required value={role} onChange={(e) => setRole(e.target.value)} placeholder="Project Manager" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="t-bio">Bio</Label>
        <Textarea id="t-bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Krótki opis (opcjonalnie)" rows={3} />
      </div>
      {createMember.isError && (
        <div className="text-xs text-destructive mt-1">{(createMember.error as Error)?.message || "Błąd podczas dodawania członka."}</div>
      )}
    </form>
  );
}
