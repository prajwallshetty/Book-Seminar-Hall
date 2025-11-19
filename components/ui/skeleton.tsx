import * as React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={"animate-pulse rounded-xl bg-muted/70 " + (className ?? "")}
      {...props}
    />
  );
}
