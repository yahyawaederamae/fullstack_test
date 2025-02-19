import React from 'react'

export default function ControlCard({ title }) {
  function startProgram() {
    window.alert('Program ' + title + ' is Start')
  }

  const restartProgram = (subtitle) => {
    window.alert('Program ' + title + 'is Restart' + subtitle)
  }

  const showData = () => {
    return (
      <div>
        <li>Hello</li>
        <li>World</li>
      </div>
    )
  }

  return (
    <div className="m-4">
      <h4>{title}</h4>
      <button className="btn btn-success" onClick={() => startProgram()}>
        Start
      </button>
      <button
        className="btn btn-warning"
        onClick={() => restartProgram('world')}
      >
        Restart
      </button>
      <button className="btn btn-danger">Down</button>
      {showData()}
    </div>
  )
}