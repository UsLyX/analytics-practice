import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Main from './Main';
import Customer from './pages/Customer';
import Lot from './pages/Lot';

function App() {
  return (
    <Router>
      <Routes>
        {/* Главный маршрут с Layout */}
        <Route path="/" element={<Main />}>
          {/* Перенаправление с корня на customer */}
          <Route index element={<Navigate to="customer" replace />} />
          
          {/* Вложенные маршруты */}
          <Route path="customer" element={<Customer />} />
          <Route path="lot" element={<Lot />} />
          
          {/* Обработка несуществующих маршрутов */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
