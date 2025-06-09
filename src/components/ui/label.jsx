import React from "react"
import { cn } from "../../utils/helpers"

const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn("block text-sm font-medium text-gray-700 mb-1", className)}
      {...props}
    />
  )
})

Label.displayName = "Label"

export { Label };
export default Label
