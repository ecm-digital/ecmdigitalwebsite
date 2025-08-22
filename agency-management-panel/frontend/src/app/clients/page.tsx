"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ClientContact {
  person: string;
  email: string;
  phone: string;
}

interface Client {
  id: number;
  name: string;
  industry: string;
  // For Supabase we may store flattened columns; keep backward compatibility by shaping data
  contact: ClientContact;
  status: string;
}

export default function ClientsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Client | null>(null);
  const { data: clients, isLoading, error } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const { data, error } = await supabase
        .from("clients")
        .select("id,name,industry,contact_person,contact_email,contact_phone,status")
        .order("id", { ascending: false });
      if (error) throw new Error(`Błąd Supabase (clients): ${error.message}`);
      return (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        industry: row.industry,
        status: row.status,
        contact: {
          person: row.contact_person,
          email: row.contact_email,
          phone: row.contact_phone,
        },
      })) as Client[];
    },
  });

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Klienci</h1>
        <Button size="sm" onClick={() => setOpen(true)}>Dodaj klienta</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dodaj klienta</DialogTitle>
            <DialogDescription>Wprowadź dane klienta. Pola z * są wymagane.</DialogDescription>
          </DialogHeader>
          <CreateClientForm
            onCreated={() => {
              qc.invalidateQueries({ queryKey: ["clients"] });
              setOpen(false);
            }}
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>Anuluj</Button>
            <Button type="submit" form="create-client-form">Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isLoading && <div className="text-muted-foreground">Ładowanie klientów...</div>}
      {error && (
        <div className="text-destructive">
          {error instanceof Error ? error.message : "Błąd podczas pobierania klientów."}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients && clients.map((client) => (
          <div
            key={client.id}
            className="rounded-lg border bg-card p-6 shadow hover:shadow-lg transition-all"
          >
            <h2 className="font-semibold text-lg mb-2">{client.name}</h2>

            <div className="text-sm text-muted-foreground mb-1">
              Branża: <span className="font-medium">{client.industry}</span>
            </div>

            <div className="text-xs mb-2">
              Status: <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary font-semibold">{client.status}</span>
            </div>

            <div className="mt-3 text-sm">
              <div className="font-medium mb-1">Kontakt</div>
              <div className="text-muted-foreground">{client.contact.person}</div>
              <div>
                <a className="text-primary hover:underline" href={`mailto:${client.contact.email}`}>
                  {client.contact.email}
                </a>
              </div>
              <div>
                <a className="text-primary hover:underline" href={`tel:${client.contact.phone.replace(/\s+/g, "")}`}>
                  {client.contact.phone}
                </a>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSelected(client); setEditOpen(true); }}
              >
                Edytuj
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => { setSelected(client); setDeleteOpen(true); }}
              >
                Usuń
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit client dialog */}
      <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) setSelected(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edytuj klienta</DialogTitle>
            <DialogDescription>Zaktualizuj dane klienta. Pola z * są wymagane.</DialogDescription>
          </DialogHeader>
          {selected && (
            <EditClientForm
              client={selected}
              onSaved={() => {
                qc.invalidateQueries({ queryKey: ["clients"] });
                setEditOpen(false);
                setSelected(null);
              }}
            />
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => { setEditOpen(false); setSelected(null); }}>Anuluj</Button>
            <Button type="submit" form="edit-client-form">Zapisz zmiany</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={(v) => { setDeleteOpen(v); if (!v) setSelected(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuń klienta</DialogTitle>
            <DialogDescription>Tej operacji nie można cofnąć. Czy na pewno chcesz usunąć klienta "{selected?.name}"?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => { setDeleteOpen(false); setSelected(null); }}>Anuluj</Button>
            <DeleteClientButton
              clientId={selected?.id || 0}
              onDeleted={() => {
                qc.invalidateQueries({ queryKey: ["clients"] });
                setDeleteOpen(false);
                setSelected(null);
              }}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function CreateClientForm({ onCreated }: { onCreated?: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [person, setPerson] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [status, setStatus] = React.useState("Aktywny");

  const createClient = useMutation({
    mutationFn: async () => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const payload = {
        name: name.trim(),
        industry: industry.trim(),
        contact_person: person.trim(),
        contact_email: email.trim(),
        contact_phone: phone.trim(),
        status: status.trim(),
      };
      const { error } = await supabase.from("clients").insert(payload);
      if (error) throw new Error(`Nie udało się utworzyć klienta: ${error.message}`);
      return true;
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error("CreateClientForm: error", err);
      toast.error((err as Error)?.message || "Nie udało się utworzyć klienta.");
    },
    onSuccess: () => {
      setName(""); setIndustry(""); setPerson(""); setEmail(""); setPhone(""); setStatus("Aktywny");
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Klient został utworzony");
      onCreated?.();
    }
  });

  return (
    <form
      id="create-client-form"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const valid = name.trim() && industry.trim() && person.trim() && email.trim() && phone.trim() && status.trim();
        if (!valid || createClient.isPending) return;
        createClient.mutate();
      }}
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          const valid = name.trim() && industry.trim() && person.trim() && email.trim() && phone.trim() && status.trim();
          if (valid && !createClient.isPending) {
            e.preventDefault();
            createClient.mutate();
          }
        }
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="c-name">Nazwa *</Label>
        <Input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nazwa klienta" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="c-industry">Branża *</Label>
        <Input id="c-industry" required value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Branża" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="c-person">Osoba kontaktowa *</Label>
        <Input id="c-person" required value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Imię i nazwisko" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="c-email">E-mail *</Label>
        <Input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@firma.com" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="c-phone">Telefon *</Label>
        <Input id="c-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+48 600 000 000" />
      </div>
      <div className="space-y-1">
        <Label>Status *</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Aktywny">Aktywny</SelectItem>
            <SelectItem value="Współpraca zawieszona">Współpraca zawieszona</SelectItem>
            <SelectItem value="Zakończony">Zakończony</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="c-notes">Notatki</Label>
        <Textarea id="c-notes" placeholder="Dodatkowe informacje (opcjonalnie)" rows={3} />
      </div>
      {createClient.isError && (
        <div className="md:col-span-2 text-xs text-destructive mt-1">{(createClient.error as Error)?.message || "Błąd podczas tworzenia klienta."}</div>
      )}
    </form>
  );
}

function EditClientForm({ client, onSaved }: { client: Client; onSaved?: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = React.useState(client.name);
  const [industry, setIndustry] = React.useState(client.industry);
  const [person, setPerson] = React.useState(client.contact.person || "");
  const [email, setEmail] = React.useState(client.contact.email || "");
  const [phone, setPhone] = React.useState(client.contact.phone || "");
  const [status, setStatus] = React.useState(client.status || "Aktywny");

  const updateClient = useMutation({
    mutationFn: async () => {
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const payload = {
        name: name.trim(),
        industry: industry.trim(),
        contact_person: person.trim(),
        contact_email: email.trim(),
        contact_phone: phone.trim(),
        status: status.trim(),
      };
      const { error } = await supabase
        .from("clients")
        .update(payload)
        .eq("id", client.id);
      if (error) throw new Error(`Nie udało się zaktualizować klienta: ${error.message}`);
      return true;
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error("EditClientForm: error", err);
      toast.error((err as Error)?.message || "Nie udało się zaktualizować klienta.");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Klient został zaktualizowany");
      onSaved?.();
    },
  });

  return (
    <form
      id="edit-client-form"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const valid = name.trim() && industry.trim() && person.trim() && email.trim() && phone.trim() && status.trim();
        if (!valid || updateClient.isPending) return;
        updateClient.mutate();
      }}
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          const valid = name.trim() && industry.trim() && person.trim() && email.trim() && phone.trim() && status.trim();
          if (valid && !updateClient.isPending) {
            e.preventDefault();
            updateClient.mutate();
          }
        }
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="e-name">Nazwa *</Label>
        <Input id="e-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nazwa klienta" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="e-industry">Branża *</Label>
        <Input id="e-industry" required value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Branża" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="e-person">Osoba kontaktowa *</Label>
        <Input id="e-person" required value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Imię i nazwisko" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="e-email">E-mail *</Label>
        <Input id="e-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@firma.com" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="e-phone">Telefon *</Label>
        <Input id="e-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+48 600 000 000" />
      </div>
      <div className="space-y-1">
        <Label>Status *</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Aktywny">Aktywny</SelectItem>
            <SelectItem value="Współpraca zawieszona">Współpraca zawieszona</SelectItem>
            <SelectItem value="Zakończony">Zakończony</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {updateClient.isError && (
        <div className="md:col-span-2 text-xs text-destructive mt-1">{(updateClient.error as Error)?.message || "Błąd podczas aktualizacji klienta."}</div>
      )}
    </form>
  );
}

function DeleteClientButton({ clientId, onDeleted }: { clientId: number; onDeleted?: () => void }) {
  const qc = useQueryClient();
  const del = useMutation({
    mutationFn: async () => {
      if (!clientId) throw new Error("Brak ID klienta");
      if (!supabase) throw new Error("Supabase nie jest skonfigurowane.");
      const { error } = await supabase.from("clients").delete().eq("id", clientId);
      if (error) throw new Error(`Nie udało się usunąć klienta: ${error.message}`);
      return true;
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error("DeleteClientButton: error", err);
      toast.error((err as Error)?.message || "Nie udało się usunąć klienta.");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Klient został usunięty");
      onDeleted?.();
    },
  });

  return (
    <Button variant="destructive" onClick={() => { if (!del.isPending) del.mutate(); }} disabled={del.isPending}>
      {del.isPending ? "Usuwanie..." : "Usuń"}
    </Button>
  );
}
