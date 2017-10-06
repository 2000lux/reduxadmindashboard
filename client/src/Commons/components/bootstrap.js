import React from 'react'

export const Row = ({children, className}) => (
  <div className={`row ${className || ''}`}>{children}</div>
)
