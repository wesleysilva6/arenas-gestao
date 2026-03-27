import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import ProtectedLayout from './ProtectedLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* ROTAS PUBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* ROTAS PROTEGIDAS */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
