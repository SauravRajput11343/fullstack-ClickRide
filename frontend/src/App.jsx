import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import './App.css'
import Path from './routes/Path'



function App() {


  return (
    <>
      <div><Toaster
        position="top-center"
        reverseOrder={false}
      /></div>
      <Path />
    </>
  )
}

export default App
