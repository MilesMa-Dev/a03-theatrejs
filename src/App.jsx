import { useEffect } from 'react';
import './App.css';
import Application from './scene3d/Application';
import { FPS } from './utils/setting';
import Ticker from './utils/tick/Ticker';

function App() {
  useEffect(() => {
    Application.init();

    Ticker.setFPS(FPS);
    Ticker.add(Application);
  }, [])

  return (
    <div className="App">
      <canvas id='three'></canvas>
      <div className='footer'>
        <p>Messy lines by <a target='_blank' href='https://twitter.com/Suje80133027'>Miles Ma</a></p>
        {/* <p>Model by <a target='_blank' href=''>XXX</a>, <a target='_blank' href='https://creativecommons.org/licenses/by/4.0/'>CC Attribution</a></p> */}
      </div>
    </div>
  )
}

export default App
