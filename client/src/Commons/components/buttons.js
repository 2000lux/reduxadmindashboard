import React from 'react'

export const ButtonContainer = ({children}) => (
  <div className="form-actions">
    {children}
  </div>
)

export const ButtonContainerRight = ({children}) => (
  <div className="form-actions pull-right">
    {children}
  </div>
)

const Button = ({onClick,children,className}) => (
  <button
    type="button"
    className={`btn ${className}`}
    onClick={onClick}>{children}</button>
)

export const ButtonBlue = ({onClick,children}) => (
  <Button className="blue" onClick={onClick}>{children}</Button>
)

export const ButtonDefault = ({onClick,children}) => (
  <Button className="default" onClick={onClick}>{children}</Button>
)

export const ButtonGreen = ({onClick,children}) => (
  <Button className="green" onClick={onClick}>{children}</Button>
)
