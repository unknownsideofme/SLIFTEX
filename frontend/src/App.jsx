import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Service from './Routes/Service';
import Headers from './components_service/Headers';


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
