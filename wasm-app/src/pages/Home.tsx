import { useState } from 'react'

declare global {
  interface Window {
    wasmFibonacciSum: (n: number) => number;
    getMock: () => any;
  }
}

function wasmFibonacciSum(n: number): Promise<number> {
  return new Promise((resolve) => {
    const res = window.wasmFibonacciSum(n)
    resolve(res)
  })
}


const Home = () => {
  return (
    <div>
      <h2>Home Page</h2>
    </div>
  );
}

export default Home
