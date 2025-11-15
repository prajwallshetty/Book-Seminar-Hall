"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Hall { id: string; name: string }
interface Department { id: string; name: string }
interface Booking { id: string; hallId: string; departmentId: string; purpose: string; startTime: string; endTime: string; hall: Hall; department?: Department; createdBy: { email: string } }

export default function BookingsClient({ halls, departments, initialData }: { halls: Hall[]; departments: Department[]; initialData: Booking[] }) {
  const [data, setData] = useState<Booking[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [filterHallId, setFilterHallId] = useState<string>("");
  const [filterDeptId, setFilterDeptId] = useState<string>("");
  const [formHallId, setFormHallId] = useState<string>(halls[0]?.id ?? "");
  const [formDeptId, setFormDeptId] = useState<string>(departments[0]?.id ?? "");

  const filtered = useMemo(() => data.filter(b => (!filterHallId || b.hallId === filterHallId) && (!filterDeptId || b.departmentId === filterDeptId)), [data, filterHallId, filterDeptId]);

  async function refresh() {
    const res = await fetch("/api/bookings");
    setData(await res.json());
  }

  async function submit(form: FormData) {
    const payload = {
      hallId: String(form.get("hallId")),
      departmentId: String(form.get("departmentId")),
      purpose: String(form.get("purpose")),
      startTime: String(form.get("startTime")),
      endTime: String(form.get("endTime")),
    };
    const url = editing ? `/api/bookings/${editing.id}` : "/api/bookings";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) {
      const msg = await res.text();
      alert(msg || "Failed");
      return;
    }
    await refresh();
    setOpen(false);
    setEditing(null);
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this booking?")) return;
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete");
      return;
    }
    await refresh();
  }

  function openCreate() {
    setEditing(null);
    setFormHallId(halls[0]?.id ?? "");
    setFormDeptId(departments[0]?.id ?? "");
    setOpen(true);
  }
  function openEdit(b: Booking) {
    setEditing(b);
    setFormHallId(b.hallId);
    setFormDeptId(b.departmentId);
    setOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <Select value={filterHallId || "all"} onValueChange={(v) => setFilterHallId(v === "all" ? "" : v)}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Filter by hall" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Halls</SelectItem>
              {halls.map(h => (
                <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterDeptId || "all"} onValueChange={(v) => setFilterDeptId(v === "all" ? "" : v)}>
            <SelectTrigger className="w-52"><SelectValue placeholder="Filter by department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <a href="/api/bookings/export"><Button variant="outline">Export CSV</Button></a>
          <Button onClick={openCreate}>New Booking</Button>
        </div>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Hall</Th>
            <Th>Department</Th>
            <Th>Purpose</Th>
            <Th>Start</Th>
            <Th>End</Th>
            <Th>By</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((b) => (
            <Tr key={b.id}>
              <Td>{b.hall.name}</Td>
              <Td>{b.department?.name || ""}</Td>
              <Td className="max-w-xs truncate" title={b.purpose}>{b.purpose}</Td>
              <Td>{new Date(b.startTime).toLocaleString()}</Td>
              <Td>{new Date(b.endTime).toLocaleString()}</Td>
              <Td>{b.createdBy.email}</Td>
              <Td className="text-right"><Button variant="ghost" onClick={() => openEdit(b)}>Edit</Button><Button variant="ghost" onClick={() => onDelete(b.id)}>Delete</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="text-lg font-semibold">{editing ? "Edit Booking" : "New Booking"}</div>
          </DialogHeader>
          <form action={async (data: FormData) => submit(data)} className="space-y-3">
            <div>
              <Label>Hall</Label>
              {/* Radix Select does not submit value; sync with hidden input */}
              <input type="hidden" name="hallId" value={formHallId} />
              <Select value={formHallId} onValueChange={setFormHallId}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {halls.map((h) => (
                    <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Department</Label>
              <input type="hidden" name="departmentId" value={formDeptId} />
              <Select value={formDeptId} onValueChange={setFormDeptId}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Purpose</Label>
              <Input name="purpose" defaultValue={editing?.purpose ?? ""} required />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label>Start</Label>
                <Input type="datetime-local" name="startTime" defaultValue={editing ? new Date(editing.startTime).toISOString().slice(0,16) : ""} required />
              </div>
              <div>
                <Label>End</Label>
                <Input type="datetime-local" name="endTime" defaultValue={editing ? new Date(editing.endTime).toISOString().slice(0,16) : ""} required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{editing ? "Save" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
