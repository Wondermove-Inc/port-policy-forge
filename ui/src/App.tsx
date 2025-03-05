import './App.css'
import '@mantine/core/styles.css'
import "reactflow/dist/style.css";
import { MantineProvider, Text, Container, Space } from '@mantine/core'
import { Topbar } from './components/Topbar/Topbar.tsx'
import Flow from './components/Flow/Flow'
import PortTable from './components/Table/Table.tsx';
import { useState } from 'react';

function App() {
  const [showCluster, setShowCluster] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const handleClusterSelect = () => {
    setShowCluster(true);
  };

  const handleShowTable = () => {
    setShowTable(true);
  }

  return (
    <MantineProvider>
      <Topbar onClusterSelect={handleClusterSelect} />
      {showCluster ? (
        <>
          {showTable && <PortTable />}
          <Flow onNodeClick={handleShowTable} onFlowClick={handleShowTable} />
        </>
      ) : (
        <Container>
          <Space h="md" />
          <Text size="xl" color="dimmed" style={{ textAlign: 'center' }}>
            To begin, select one of the cluster.
          </Text>
        </Container>
      )}
    </MantineProvider>
  )
}

export default App;