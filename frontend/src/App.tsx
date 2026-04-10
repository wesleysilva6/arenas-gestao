import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import ProtectedLayout from './ProtectedLayout';
import Dashboard from './pages/dashboard/Index';
import Alunos from './pages/alunos/Index';
import Modalidades from './pages/modalidades/Index';

function App() {
  return (
    <Router>
      <Routes>
        {/* ROTAS PUBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* ROTAS PROTEGIDAS */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/modalidades" element={<Modalidades />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
