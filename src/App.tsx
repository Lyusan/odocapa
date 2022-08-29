import './App.css';
import Map from './component/Map';
import { useEffect } from 'react';
import ColorPicker from './component/ColorPicker';
function App() {

  useEffect(() => {console.log("App mounted")}, [])
  

  return (
    <div className="App">
      <Map></Map>
    </div>
  );
}

export default App;
