import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "~/lib/utils";

type DoodleFrameProps<T extends ElementType = "div"> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export const DoodleFrame = <T extends ElementType = "div">({
  as,
  className,
  children,
  ...props
}: DoodleFrameProps<T>) => {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-[calc(var(--radius)+0.5rem)] bg-white/90 backdrop-blur-sm dark:bg-slate-900/70",
        "sketch-border sketch-shadow",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-2 rounded-[calc(var(--radius)+0.25rem)] border border-white/40 mix-blend-multiply blur-[1px] dark:border-white/10"
      />
      {children}
    </Component>
  );
};
