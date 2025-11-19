import * as React from "react";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <table className={"w-full border-collapse text-sm " + (className ?? "")} {...props} />;
}
export function Thead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground" {...props} />;
}
export function Tbody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}
export function Tr(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className="border-b border-neutral-100/80 last:border-b-0 transition-all duration-200 ease-out hover:bg-muted/40 dark:border-neutral-800/80" {...props} />;
}
export function Th(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className="px-4 py-3 text-left font-medium" {...props} />;
}
export function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className="px-4 py-3 align-middle" {...props} />;
}
