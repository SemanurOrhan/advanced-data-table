export function Badge({ className = "", variant = "default", children, ...props }) {
  // Basit bir varyant sistemi
  let baseClass = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-card"
  let variantClass = ""
  switch (variant) {
    case "secondary":
      variantClass = "bg-secondary text-white"
      break
    case "outline":
      variantClass = "border border-primary bg-accent text-primary"
      break
    default:
      variantClass = "bg-primary text-white"
  }
  return (
    <span className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  )
}

export default Badge
