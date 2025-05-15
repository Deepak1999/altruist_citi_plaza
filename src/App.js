import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import MainLayout from './Components/MainLayout/MainLayout';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import Dashboard from './Components/Dashboard/Dashboard';
import AddRent from './Components/Rent_Management/AddRent';
import ViewRent from './Components/Rent_Management/ViewRent';
import { AuthProvider } from './Components/Auth/AuthContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<MainLayout><Dashboard /></MainLayout>} />}
          />
          <Route
            path="/addRent"
            element={<PrivateRoute element={<MainLayout><AddRent /></MainLayout>} />}
          />
          <Route
            path="/viewRent"
            element={<PrivateRoute element={<MainLayout><ViewRent /></MainLayout>} />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
