import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Routes/Home';
import Service from './Routes/Service';
import AuthPage from './Routes/AuthPage';
import Headers from './components_service/Headers';
import Page from './Routes/Page';

function App() {
  return (
    <div className="App">
        <Headers />
        <Routes>
        <Route path="/" element={<Home />} /> 
         
        <Route path="/service" element={<Service />} />
        <Route path="/auth" element={<AuthPage/>} />
        <Route path="/page" element ={<Page/>} />
          
        </Routes>
      
    </div>
  );
}

export default App;
