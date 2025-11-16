import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-200";
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "border-transparent bg-foreground text-background",
    secondary: "border-transparent bg-muted text-foreground hover:bg-muted/80",
    outline: "border-border text-foreground hover:bg-accent/40",
    destructive: "border-transparent bg-destructive text-destructive-foreground",
  };

  return (
    <span
      className={base + " " + variants[variant] + " " + (className ?? "")}
      {...props}
    />
  );
}
