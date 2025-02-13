import { useEffect, useState } from 'react';
import '../public/wasm_exec.js';  
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Namespace from './pages/Namespace';
import Workloads from './pages/Workload.tsx';
import Port from './pages/Port.tsx';
import { loadWasm } from './wasmLoader.tsx';

declare global {
  interface Window {
    Go: any;
  }
}

const App = () => {
  const [isWasmLoaded, setIsWasmLoaded] = useState(false)

  useEffect(() => {
    loadWasm()
      .then(() => setIsWasmLoaded(true))
      .catch((err) => {
        console.error('WASM 로딩 에러:', err)
      })
  }, [])


  if (!isWasmLoaded) {
    return <p>Loading WASM...</p>
  }

  return (
    <div style={{ padding: '20px' }}>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/namespace">Namespace</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/namespace" element={<Namespace />} />
        <Route path="/namespace/:namespaceName" element={<Workloads />} />
        <Route path="/namespace/:namespaceName/workload/:workloadId/ports" element={<Port />} />
      </Routes>
    </div>
  )
}

export default App