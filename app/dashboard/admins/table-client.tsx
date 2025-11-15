"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Admin { id: string; name: string | null; email: string; role: "SUPER_ADMIN" | "ADMIN"; createdAt: string }

export default function AdminsClient({ initialData }: { initialData: Admin[] }) {
  const [data, setData] = useState<Admin[]>(initialData);
  const [open, setOpen] = useState(false);

  async function refresh() {
    const res = await fetch("/api/admins");
    setData(await res.json());
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>New Admin</Button>
      </div>
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
          {data.map((u) => (
            <Tr key={u.id}>
              <Td>{u.name || "—"}</Td>
              <Td>{u.email}</Td>
              <Td>{u.role}</Td>
              <Td>{new Date(u.createdAt).toLocaleString()}</Td>
              <Td className="text-right"><Button variant="ghost" onClick={() => remove(u.id)}>Delete</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

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
