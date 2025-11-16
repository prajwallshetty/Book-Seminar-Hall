"use client";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 " +
        (className ?? "")
      }
      {...props}
    />
  )
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Content
      ref={ref}
      className={
        "z-50 max-h-64 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-lg " +
        (className ?? "")
      }
      {...props}
    />
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={
        "relative flex cursor-pointer select-none items-center rounded-sm bg-background px-2 py-1.5 text-sm outline-none transition-colors duration-150 data-[highlighted]:bg-foreground data-[highlighted]:text-background data-[state=checked]:font-semibold " +
        (className ?? "")
      }
      {...props}
    />
  )
);
SelectItem.displayName = SelectPrimitive.Item.displayName;
