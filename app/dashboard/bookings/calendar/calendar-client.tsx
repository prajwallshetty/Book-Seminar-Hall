"use client";
import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Hall { id: string; name: string }
interface Department { id: string; name: string }
interface Booking { id: string; hallId: string; departmentId: string; purpose: string; startTime: string; endTime: string; hall: Hall; department?: Department; createdBy: { email: string } }

function toDateKey(d: Date) {
  return d.toISOString().slice(0,10);
}

export default function CalendarClient({ halls, departments, initialData }: { halls: Hall[]; departments: Department[]; initialData: Booking[] }) {
  const [data, setData] = useState<Booking[]>(initialData);
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [hallFilter, setHallFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const filtered = useMemo(
    () =>
      data.filter(
        (b) =>
          (hallFilter === "all" || b.hallId === hallFilter) &&
          (deptFilter === "all" || b.departmentId === deptFilter)
      ),
    [data, hallFilter, deptFilter]
  );

  const hallFilterLabel =
    hallFilter === "all"
      ? "All Halls"
      : halls.find((h) => h.id === hallFilter)?.name || "Select hall";

  const deptFilterLabel =
    deptFilter === "all"
      ? "All Departments"
      : departments.find((d) => d.id === deptFilter)?.name || "Select department";

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

  function getStatus(b: Booking): "UPCOMING" | "ONGOING" | "PAST" {
    const now = new Date();
    const start = new Date(b.startTime);
    const end = new Date(b.endTime);
    if (end < now) return "PAST";
    if (start > now) return "UPCOMING";
    return "ONGOING";
  }

  return (
    <div className="grid gap-6 md:grid-cols-[340px_1fr] text-sm">
      <div className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm">
        <div className="grid gap-2">
          <Label>Hall</Label>
          <Select
            value={hallFilter}
            onValueChange={setHallFilter}
          >
            <SelectTrigger className="w-full rounded-xl text-xs">
              <span className="truncate">{hallFilterLabel}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Halls</SelectItem>
              {halls.map((h) => (
                <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Department</Label>
          <Select
            value={deptFilter}
            onValueChange={setDeptFilter}
          >
            <SelectTrigger className="w-full rounded-xl text-xs">
              <span className="truncate">{deptFilterLabel}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background p-3 text-xs shadow-sm">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            modifiers={{ hasBookings: (day) => !!byDay[toDateKey(day)] }}
            modifiersStyles={{
              hasBookings: {
                backgroundColor: "hsl(var(--accent))",
                color: "hsl(var(--accent-foreground))",
              },
            }}
            className="rdp rdq text-xs"
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>
            {selected ? selected.toDateString() : "Select a date"}
          </div>
          <div className="rounded-full border border-border/70 px-2 py-0.5">
            {dayBookings.length} booking(s)
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm">
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
              </Tr>
            </Thead>
            <Tbody>
              {dayBookings.map((b) => (
                <Tr
                  key={b.id}
                  className="group transition-all duration-150 hover:bg-accent/40 hover:text-foreground"
                >
                  <Td className="whitespace-nowrap font-medium">{b.hall.name}</Td>
                  <Td className="whitespace-nowrap text-muted-foreground group-hover:text-foreground">
                    {b.department?.name || ""}
                  </Td>
                  <Td
                    title={b.purpose}
                    className="max-w-xs truncate text-muted-foreground group-hover:text-foreground"
                  >
                    {b.purpose}
                  </Td>
                  <Td className="whitespace-nowrap">
                    {new Date(b.startTime).toLocaleTimeString()}
                  </Td>
                  <Td className="whitespace-nowrap">
                    {new Date(b.endTime).toLocaleTimeString()}
                  </Td>
                  <Td className="whitespace-nowrap">
                    <Badge
                      className={
                        "rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide " +
                        (getStatus(b) === "PAST"
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-green-600 text-white")
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
                    {b.createdBy.email}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
