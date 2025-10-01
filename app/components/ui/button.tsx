import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--radius)+0.3rem)] border-2 border-transparent text-sm font-semibold tracking-wide shadow-[3px_3px_0_rgba(33,33,33,0.12)] transition-transform duration-150 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:-translate-y-[2px] hover:shadow-[5px_5px_0_rgba(33,33,33,0.18)] active:translate-y-0 active:shadow-[2px_2px_0_rgba(33,33,33,0.2)] dark:focus-visible:ring-offset-slate-950 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-primary/50 bg-primary text-primary-foreground",
        destructive:
          "border-destructive/40 bg-destructive text-white focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-dashed border-border bg-background/80 text-foreground hover:bg-accent/40 hover:text-accent-foreground dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "border-secondary/50 bg-secondary text-secondary-foreground",
        ghost:
          "border-0 bg-transparent shadow-none hover:bg-accent/30 hover:text-accent-foreground",
        link:
          "border-none bg-transparent p-0 text-primary underline-offset-4 shadow-none hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-9 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-11 px-7 has-[>svg]:px-5",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
