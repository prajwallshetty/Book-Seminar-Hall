"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Admin { id: string; name: string | null; email: string; role: "SUPER_ADMIN" | "ADMIN"; createdAt: string }

export default function AdminsClient({ initialData }: { initialData: Admin[] }) {
  const [data, setData] = useState<Admin[]>(initialData);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    try {
      setLoading(true);
      const res = await fetch("/api/admins");
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  }

  function formatDateTime(value: string) {
    const d = new Date(value);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(d);
  }

  async function create(form: FormData) {
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      role: String(form.get("role") || "ADMIN"),
    };
    const res = await fetch("/api/admins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) {
      alert(await res.text());
      return;
    }
    await refresh();
    setOpen(false);
  }

  async function remove(id: string) {
    if (!confirm("Remove this admin?")) return;
    const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to remove");
      return;
    }
    await refresh();
  }

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between rounded-2xl bg-white p-3">
        <div className="text-xs font-medium text-muted-foreground">
          Manage admins with access to this console.
        </div>
        <Button onClick={() => setOpen(true)} className="rounded-xl text-xs">
          New Admin
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl bg-card/90">
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Created</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Tr key={i}>
                    <Td><Skeleton className="h-4 w-24 rounded-full" /></Td>
                    <Td><Skeleton className="h-4 w-40 rounded-full" /></Td>
                    <Td><Skeleton className="h-4 w-20 rounded-full" /></Td>
                    <Td><Skeleton className="h-4 w-32 rounded-full" /></Td>
                    <Td className="text-right"><Skeleton className="ml-auto h-7 w-14 rounded-full" /></Td>
                  </Tr>
                ))
              : data.map((u) => (
                  <Tr key={u.id}>
                    <Td>{u.name || "—"}</Td>
                    <Td>{u.email}</Td>
                    <Td>{u.role}</Td>
                    <Td>{formatDateTime(u.createdAt)}</Td>
                    <Td className="text-right">
                      <Button variant="ghost" onClick={() => remove(u.id)} className="h-7 rounded-full px-2 text-xs">
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
          </Tbody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="text-lg font-semibold">Create Admin</div>
          </DialogHeader>
          <form action={async (f: FormData) => create(f)} className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input name="name" placeholder="Optional" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" name="password" required />
            </div>
            <div>
              <Label>Role</Label>
              <input type="hidden" name="role" value="ADMIN" />
              <Select defaultValue="ADMIN" onValueChange={(v) => {
                const hidden = document.querySelector<HTMLInputElement>('input[name="role"]');
                if (hidden) hidden.value = v;
              }}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
