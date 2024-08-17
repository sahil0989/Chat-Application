import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ChatApplicztion from './ChatApplicztion';
import ChatSection from './Components/ChatSection';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ChatApplicztion />} />
        <Route path='/:id' element={<ChatSection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
