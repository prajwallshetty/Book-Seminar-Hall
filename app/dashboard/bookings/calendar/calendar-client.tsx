"use client";
import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";

interface Hall { id: string; name: string }
interface Department { id: string; name: string }
interface Booking { id: string; hallId: string; departmentId: string; purpose: string; startTime: string; endTime: string; hall: Hall; department?: Department; createdBy: { email: string } }

function toDateKey(d: Date) {
  return d.toISOString().slice(0,10);
}

export default function CalendarClient({ halls, departments, initialData }: { halls: Hall[]; departments: Department[]; initialData: Booking[] }) {
  const [data, setData] = useState<Booking[]>(initialData);
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [hallFilter, setHallFilter] = useState<string>("");
  const [deptFilter, setDeptFilter] = useState<string>("");

  const filtered = useMemo(() => data.filter(b => (!hallFilter || b.hallId === hallFilter) && (!deptFilter || b.departmentId === deptFilter)), [data, hallFilter, deptFilter]);

  const byDay = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const b of filtered) {
      const k = toDateKey(new Date(b.startTime));
      (map[k] ||= []).push(b);
    }
    return map;
  }, [filtered]);

  const selectedKey = selected ? toDateKey(selected) : "";
  const dayBookings = byDay[selectedKey] || [];

  return (
    <div className="grid gap-6 md:grid-cols-[340px_1fr]">
      <div className="space-y-3">
        <div className="grid gap-2">
          <Label>Hall</Label>
          <Select value={hallFilter || "all"} onValueChange={(v) => setHallFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="All Halls" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Halls</SelectItem>
              {halls.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Department</Label>
          <Select value={deptFilter || "all"} onValueChange={(v) => setDeptFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="All Departments" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          modifiers={{ hasBookings: (day) => !!byDay[toDateKey(day)] }}
          modifiersStyles={{ hasBookings: { backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" } }}
          className="rounded-md border p-3"
        />
      </div>
      <div>
        <div className="mb-3 text-sm text-muted-foreground">{selected ? selected.toDateString() : "Select a date"} — {dayBookings.length} booking(s)</div>
        <Table>
          <Thead>
            <Tr>
              <Th>Hall</Th>
              <Th>Department</Th>
              <Th>Purpose</Th>
              <Th>Start</Th>
              <Th>End</Th>
              <Th>By</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dayBookings.map(b => (
              <Tr key={b.id}>
                <Td>{b.hall.name}</Td>
                <Td>{b.department?.name || ""}</Td>
                <Td title={b.purpose} className="max-w-xs truncate">{b.purpose}</Td>
                <Td>{new Date(b.startTime).toLocaleTimeString()}</Td>
                <Td>{new Date(b.endTime).toLocaleTimeString()}</Td>
                <Td>{b.createdBy.email}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
