import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-neon-purple/40 bg-neon-purple/15 text-purple-200",
        outline: "border-white/15 bg-white/5 text-muted",
        pink: "border-neon-pink/40 bg-neon-pink/15 text-pink-200",
        cyan: "border-neon-cyan/40 bg-neon-cyan/15 text-cyan-200",
        gold: "border-yellow-400/40 bg-yellow-400/15 text-yellow-200",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
