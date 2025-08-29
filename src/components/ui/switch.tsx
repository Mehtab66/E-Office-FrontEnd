

import * as React from "react";
import { Switch as RadixSwitch } from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../libs/utils";

const switchVariants = cva(
  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
  {
    variants: {
      variant: {
        default: "bg-input data-[state=checked]:bg-primary",
        destructive: "bg-destructive/30 data-[state=checked]:bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const thumbVariants = cva(
  "block h-4 w-4 rounded-full bg-background transition-transform data-[state=checked]:translate-x-5",
  {
    variants: {
      variant: {
        default: "bg-background",
        destructive: "bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SwitchProps
  extends React.ComponentProps<typeof RadixSwitch>,
    VariantProps<typeof switchVariants> {}

function Switch({ className, variant, ...props }: SwitchProps) {
  return (
    <RadixSwitch
      className={cn(switchVariants({ variant, className }))}
      {...props}
    >
      <span className={cn(thumbVariants({ variant }))} />
    </RadixSwitch>
  );
}

export { Switch, switchVariants };