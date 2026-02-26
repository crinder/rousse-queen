import { useState } from 'react'
import Routing from './Components/Routing/Routing';
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (

    <>
      <Router>
        <Routing />
      </Router>
    </>
  )
}

export default App
