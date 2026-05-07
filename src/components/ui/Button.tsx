import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "premium";
    size?: "default" | "sm" | "lg" | "icon" | "xl";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
        const variants = {
            default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20",
            outline: "border-2 border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/40 text-primary shadow-sm",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent/50 hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
            premium: "premium-gradient text-white hover:premium-gradient-hover shadow-xl shadow-primary/25 hover:shadow-primary/30",
        };

        const sizes = {
            default: "h-12 px-8 py-3",
            sm: "h-10 rounded-xl px-4 text-xs",
            lg: "h-14 rounded-2xl px-10 text-base font-bold tracking-tight",
            xl: "h-16 rounded-[1.5rem] px-12 text-lg font-black tracking-tight",
            icon: "h-12 w-12",
        };

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
