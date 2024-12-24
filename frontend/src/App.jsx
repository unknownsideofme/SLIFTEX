import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Routes/Home';
import Service from './Routes/Service';


function App() {
  return (
    <div className="App">
      
        <Routes>
        <Route path="/" element={<Home />} /> 
         
             <Route path="/service" element={<Service />} />
          
        </Routes>
      
    </div>
  );
}

export default App;
