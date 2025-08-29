import { useState } from 'react'
import Kanoon1 from './components/Kanoon1'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Kanoon1 />
    </>
  )
}

export default App
