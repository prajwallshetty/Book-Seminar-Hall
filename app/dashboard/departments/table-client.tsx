"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Department { id: string; name: string; createdAt: string }

export default function DepartmentsClient({ initialData }: { initialData: Department[] }) {
  const [data, setData] = useState<Department[]>(initialData);
  const [open, setOpen] = useState(false);

  async function refresh() {
    const res = await fetch("/api/departments");
    setData(await res.json());
  }

  async function create(form: FormData) {
    const name = String(form.get("name") || "").trim();
    if (!name) return;
    const res = await fetch("/api/departments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    if (!res.ok) {
      alert(await res.text());
      return;
    }
    await refresh();
    setOpen(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this department?")) return;
    const res = await fetch(`/api/departments/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete");
      return;
    }
    await refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>New Department</Button>
      </div>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Created</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((d) => (
            <Tr key={d.id}>
              <Td>{d.name}</Td>
              <Td>{new Date(d.createdAt).toLocaleString()}</Td>
              <Td className="text-right"><Button variant="ghost" onClick={() => remove(d.id)}>Delete</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="text-lg font-semibold">Create Department</div>
          </DialogHeader>
          <form action={async (f: FormData) => create(f)} className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input name="name" placeholder="e.g. Computer Science" required />
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
