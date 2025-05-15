import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import MainLayout from './Components/MainLayout/MainLayout';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import Dashboard from './Components/Dashboard/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<MainLayout><Dashboard /></MainLayout>} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
