import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import Reports from './pages/Reports'

function App() {
  const { isAuthenticated, role } = useSelector((state) => state.auth)

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={isAuthenticated && role === 'admin' ? <AdminPanel /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/reports" 
          element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App