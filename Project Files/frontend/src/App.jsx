import { useState } from 'react';
import Home from './components/common/Home';
import Login from './components/common/Login';
import SignUp from './components/common/SignUp';
import './App.css';

import HomePage from './components/user/HomePage';
import AdminHome from './components/admin/AdminHome';
import AgentHome from './components/agent/AgentHome';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.userType === 'Customer') return 'customer-home';
        if (user.userType === 'Agent') return 'agent-home';
        if (user.userType === 'Admin') return 'admin-home';
      } catch (e) {
        console.error('Failed to parse user data', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return 'home';
  });

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignUp onNavigate={setCurrentPage} />;
      case 'customer-home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'admin-home':
        return <AdminHome onNavigate={setCurrentPage} />;
      case 'agent-home':
        return <AgentHome onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      {renderPage()}
    </div>
  );
}

export default App;
