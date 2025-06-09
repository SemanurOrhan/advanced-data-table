import React from "react"

const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select ref={ref} className={className} {...props}>
    {children}
  </select>
))
Select.displayName = "Select"

export default Select
export { Select }

