import React from 'react'
export default ({content}) => (
  <span>{content.replace(/(<([^>]+)>)/ig,"")}</span>
)
