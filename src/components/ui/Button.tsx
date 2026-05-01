import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-[var(--color-primary)] text-white border-transparent overflow-hidden relative z-0 before:absolute before:inset-0 before:bg-[var(--color-primary-hover)] before:origin-left before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300 before:-z-10 transition-colors",
      secondary: "bg-[var(--color-black)] text-white border-transparent overflow-hidden relative z-0 before:absolute before:inset-0 before:bg-[var(--color-grey-800)] before:origin-left before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300 before:-z-10 transition-colors",
      outline: "bg-transparent border-2 border-[var(--color-black)] text-[var(--color-black)] hover:text-white overflow-hidden relative z-0 before:absolute before:inset-0 before:bg-[var(--color-black)] before:origin-left before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300 before:-z-10 transition-colors",
      ghost: "bg-transparent text-[var(--color-black)] border-transparent overflow-hidden relative z-0 before:absolute before:inset-0 before:bg-[var(--color-grey-100)] before:origin-left before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300 before:-z-10 transition-colors",
    };

    const sizes = {
      sm: "h-10 px-4 text-sm font-bold tracking-wider uppercase",
      md: "h-12 px-6 text-base font-bold tracking-wider uppercase",
      lg: "h-14 px-8 text-lg font-bold tracking-wider uppercase",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
