import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import useCountdown from './useCountdown';

function App() {
  const [color, setColor] = useState('red');

  const countdown = useCountdown(() => Date.now() + 10000000);

  useEffect(() => {
    const colors = ['red', 'green', 'blue'];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setColor(colors[i % 3]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p style={{ backgroundColor: color }}>{countdown}</p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
