import React from "react"
import { cn } from "../../utils/helpers"

// Basit bir buttonVariants fonksiyonu (cva olmadan)
function buttonVariants({ variant = "default", size = "default", className = "" }) {
  const variantClasses = {
    default: "bg-primary text-white hover:bg-primary-dark shadow-card",
    destructive: "bg-red-600 text-white hover:bg-red-700 shadow-card",
    outline: "border border-primary bg-white hover:bg-primary text-primary hover:text-white",
    secondary: "bg-secondary text-white hover:bg-primary-dark shadow-card",
    ghost: "hover:bg-accent text-muted",
    link: "text-primary underline-offset-4 hover:underline bg-transparent",
  }
  const sizeClasses = {
    default: "h-10 px-4 py-2 text-base",
    sm: "h-9 rounded-md px-3 text-sm",
    lg: "h-11 rounded-xl px-8 text-lg",
    icon: "h-10 w-10",
  }
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.default,
    className
  )
}

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
})

Button.displayName = "Button"

export { Button }
export default Button
