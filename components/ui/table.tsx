import * as React from "react";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <table className={"w-full border-collapse text-sm " + (className ?? "")} {...props} />;
}
export function Thead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-muted/60" {...props} />;
}
export function Tbody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}
export function Tr(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className="border-b border-border/40 last:border-0 transition-colors duration-200 hover:bg-accent/40" {...props} />;
}
export function Th(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className="px-3 py-2 text-left font-medium" {...props} />;
}
export function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className="px-3 py-2" {...props} />;
}
