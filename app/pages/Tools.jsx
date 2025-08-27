import React from 'react'
import FileUpload from './FileUpload'
import YouWebTool from './YouWebTool'

function Tools() {
  return (
    <div className="space-y-4 p-2 sm:p-3 md:p-4">
        <FileUpload />
        <YouWebTool />
    </div>
  )
}

export default Tools