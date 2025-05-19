import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import MainLayout from './Components/MainLayout/MainLayout';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import Dashboard from './Components/Dashboard/Dashboard';
import AddRent from './Components/Rent_Management/AddRent';
import ViewRent from './Components/Rent_Management/ViewRent';
import { AuthProvider } from './Components/Auth/AuthContext';
import Profile from './Components/Profile/Profile';
import AddMeterRecharge from './Components/Electricity_Management/AddMeterRecharge';
import ViewMeterRecharge from './Components/Electricity_Management/ViewMeterRecharge';

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
          <Route
            path="/my-profile"
            element={<PrivateRoute element={<MainLayout><Profile /></MainLayout>} />}
          />
          <Route
            path="/addMeterRecharge"
            element={<PrivateRoute element={<MainLayout><AddMeterRecharge /></MainLayout>} />}
          />
          <Route
            path="/viewMeterRecharge"
            element={<PrivateRoute element={<MainLayout><ViewMeterRecharge /></MainLayout>} />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
