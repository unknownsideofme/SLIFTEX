import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Headers from './components_service/Headers';

import Service from './Routes/Service';



function App() {
  return (
    <div className="App">
        <Headers />
        <Routes>
        <Route path="/" element={<Service />} />
          
        </Routes>
      
    </div>
  );
}

export default App;
