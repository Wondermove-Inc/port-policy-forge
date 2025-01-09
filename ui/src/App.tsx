import './App.css'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { Topbar } from './components/Topbar/Topbar.tsx'
import { Content } from './components/Content/Content.tsx'

function App() {
  return (
    <MantineProvider>
      <Topbar />
      <Content />
    </MantineProvider>
  )
}

export default App;