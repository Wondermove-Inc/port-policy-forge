import { useState } from 'react'

declare global {
  interface Window {
    MyGoFunc(url: string): Promise<Response>
  }
}

const Home = () => {
  const [result, setResult] = useState<string>('');

  // const handleCallMyGoFunc = async () => {
  //   try {
  //     const url = 'http://localhost:3001/clusters'
  //     const response = await window.MyGoFunc(url);  
  //     const text = await response.text();
  //     setResult(text);
  //   } catch (error) {
  //     console.error("Error fetching logs:", error);
  //     setResult(`Error: ${error}`);
  //   }
  // }

  return (
    <div>
      <h2>Home Page</h2>
      {/* <button onClick={handleCallMyGoFunc}>Call MyGoFunc</button>
      <div style={{ marginTop: '20px' }}>
        <pre>{result}</pre>
      </div> */}
    </div>
  );
}

export default Home