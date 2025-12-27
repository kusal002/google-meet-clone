import { useState } from 'react'
import { Outlet } from 'react-router-dom'

function App() {
      // console.log("app rendered");

  return (
    <>
    <div className="App">
      
    <Outlet/>
    </div>
    </>
  )
}

export default App
