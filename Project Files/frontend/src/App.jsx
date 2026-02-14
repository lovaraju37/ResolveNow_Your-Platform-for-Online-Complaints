import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/common/Home';
import Login from './components/common/Login';
import SignUp from './components/common/SignUp';
import './App.css';

import HomePage from './components/user/HomePage';
import AdminHome from './components/admin/AdminHome';
import AgentHome from './components/agent/AgentHome';
import Profile from './components/common/Profile';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    // Redirect to their respective home if role doesn't match
    if (user.userType === 'Customer') return <Navigate to="/customer-home" replace />;
    if (user.userType === 'Agent') return <Navigate to="/agent-home" replace />;
    if (user.userType === 'Admin') return <Navigate to="/admin-home" replace />;
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route 
          path="/customer-home" 
          element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-home" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/agent-home" 
          element={
            <ProtectedRoute allowedRoles={['Agent']}>
              <AgentHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/update-profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
