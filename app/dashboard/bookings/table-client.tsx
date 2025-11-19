"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Hall { id: string; name: string }
interface Department { id: string; name: string }
interface Booking {
  id: string;
  hallId: string;
  departmentId: string;
  purpose: string;
  startTime: string;
  endTime: string;
  hall: Hall;
  department?: Department;
  createdBy?: { email: string };
}

export default function BookingsClient({ halls, departments, initialData }: { halls: Hall[]; departments: Department[]; initialData: Booking[] }) {
  const [data, setData] = useState<Booking[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [filterHallId, setFilterHallId] = useState<string>("all");
  const [filterDeptId, setFilterDeptId] = useState<string>("all");
  const [formHallId, setFormHallId] = useState<string>(halls[0]?.id ?? "");
  const [formDeptId, setFormDeptId] = useState<string>(departments[0]?.id ?? "");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(
    () =>
      data.filter(
        (b) =>
          (filterHallId === "all" || b.hallId === filterHallId) &&
          (filterDeptId === "all" || b.departmentId === filterDeptId)
      ),
    [data, filterHallId, filterDeptId]
  );

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

  const filterHallLabel =
    filterHallId === "all"
      ? "All Halls"
      : halls.find((h) => h.id === filterHallId)?.name || "Select hall";

  const filterDeptLabel =
    filterDeptId === "all"
      ? "All Departments"
      : departments.find((d) => d.id === filterDeptId)?.name || filterDeptId || "Select department";

  const formHallLabel =
    halls.find((h) => h.id === formHallId)?.name || "Select hall";

  const formDeptLabel =
    departments.find((d) => d.id === formDeptId)?.name || "Select department";

  function getStatus(b: Booking): "UPCOMING" | "ONGOING" | "PAST" {
    const now = new Date();
    const start = new Date(b.startTime);
    const end = new Date(b.endTime);
    if (end < now) return "PAST";
    if (start > now) return "UPCOMING";
    return "ONGOING";
  }

  async function refresh() {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings");
      setData(await res.json());
    } finally {
      setLoading(false);
    }
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
    <div className="space-y-4 text-sm">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={filterHallId} onValueChange={setFilterHallId}>
            <SelectTrigger className="w-48 rounded-xl text-xs">
              <span className="truncate">{filterHallLabel}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Halls</SelectItem>
              {halls.map((h) => (
                <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterDeptId} onValueChange={setFilterDeptId}>
            <SelectTrigger className="w-52 rounded-xl text-xs">
              <span className="truncate">{filterDeptLabel}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/api/bookings/export">
            <Button variant="outline" className="rounded-xl text-xs">
              Export CSV
            </Button>
          </a>
          <Button onClick={openCreate} className="rounded-xl text-xs">
            New Booking
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-card/90">
        <Table>
          <Thead>
            <Tr>
              <Th>Hall</Th>
              <Th>Department</Th>
              <Th>Purpose</Th>
              <Th>Start</Th>
              <Th>End</Th>
              <Th>Status</Th>
              <Th>By</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Tr key={i} className="border-b last:border-0">
                    <Td className="whitespace-nowrap font-medium">
                      <Skeleton className="h-4 w-20 rounded-full" />
                    </Td>
                    <Td className="whitespace-nowrap">
                      <Skeleton className="h-4 w-24 rounded-full" />
                    </Td>
                    <Td className="max-w-xs">
                      <Skeleton className="h-4 w-32 rounded-full" />
                    </Td>
                    <Td className="whitespace-nowrap">
                      <Skeleton className="h-4 w-28 rounded-full" />
                    </Td>
                    <Td className="whitespace-nowrap">
                      <Skeleton className="h-4 w-28 rounded-full" />
                    </Td>
                    <Td className="whitespace-nowrap">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </Td>
                    <Td className="whitespace-nowrap">
                      <Skeleton className="h-4 w-32 rounded-full" />
                    </Td>
                    <Td className="w-0 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Skeleton className="h-7 w-12 rounded-full" />
                        <Skeleton className="h-7 w-14 rounded-full" />
                      </div>
                    </Td>
                  </Tr>
                ))
              : filtered.map((b) => (
                  <Tr
                    key={b.id}
                    className="group transition-all duration-150 hover:bg-accent/40 hover:text-foreground"
                  >
                    <Td className="whitespace-nowrap font-medium">{b.hall.name}</Td>
                    <Td className="whitespace-nowrap text-muted-foreground group-hover:text-foreground">
                      {b.department?.name || ""}
                    </Td>
                    <Td
                      className="max-w-xs truncate text-muted-foreground group-hover:text-foreground"
                      title={b.purpose}
                    >
                      {b.purpose}
                    </Td>
                    <Td className="whitespace-nowrap">
                      {formatDateTime(b.startTime)}
                    </Td>
                    <Td className="whitespace-nowrap">
                      {formatDateTime(b.endTime)}
                    </Td>
                    <Td className="whitespace-nowrap">
                      <Badge
                        className={
                          "rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide " +
                          (getStatus(b) === "PAST"
                            ? "bg-destructive text-destructive-foreground"
                            : getStatus(b) === "ONGOING"
                            ? "bg-black text-white"
                            : "bg-muted text-foreground")
                        }
                      >
                        {getStatus(b) === "UPCOMING"
                          ? "Upcoming"
                          : getStatus(b) === "ONGOING"
                          ? "Ongoing"
                          : "Completed"}
                      </Badge>
                    </Td>
                    <Td className="whitespace-nowrap text-muted-foreground group-hover:text-foreground">
                      {b.createdBy?.email ?? ""}
                    </Td>
                    <Td className="w-0 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          className="h-7 rounded-full px-2 text-xs"
                          onClick={() => openEdit(b)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-7 rounded-full px-2 text-xs text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete(b.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
          </Tbody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="text-lg font-semibold">
              {editing ? "Edit Booking" : "New Booking"}
            </div>
          </DialogHeader>
          <form
            action={async (data: FormData) => submit(data)}
            className="space-y-3"
          >
            <div className="space-y-1.5">
              <Label>Hall</Label>
              <select
                name="hallId"
                value={formHallId}
                onChange={(e) => setFormHallId(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <option value="" disabled>
                  Select hall
                </option>
                {halls.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <select
                name="departmentId"
                value={formDeptId}
                onChange={(e) => setFormDeptId(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <option value="" disabled>
                  Select department
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Purpose</Label>
              <Input
                name="purpose"
                defaultValue={editing?.purpose ?? ""}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Start</Label>
                <Input
                  type="datetime-local"
                  name="startTime"
                  defaultValue={
                    editing
                      ? new Date(editing.startTime).toISOString().slice(0, 16)
                      : ""
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>End</Label>
                <Input
                  type="datetime-local"
                  name="endTime"
                  defaultValue={
                    editing
                      ? new Date(editing.endTime).toISOString().slice(0, 16)
                      : ""
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="rounded-xl text-sm">
                {editing ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
