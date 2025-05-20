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
import ViewMonthlyCons from './Components/Electricity_Management/ViewMonthlyCons';
import AddMonthlyCons from './Components/Electricity_Management/AddMonthlyCons';
import ViewGopal from './Components/SalesManagements/ViewGopal';
import ViewAyaanCinema from './Components/SalesManagements/ViewAyaanCinema';
import AddGopal from './Components/SalesManagements/AddGopal';

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
          <Route
            path="/addElecCons"
            element={<PrivateRoute element={<MainLayout><AddMonthlyCons /></MainLayout>} />}
          />
          <Route
            path="/viewElecCons"
            element={<PrivateRoute element={<MainLayout><ViewMonthlyCons /></MainLayout>} />}
          />
          <Route
            path="/addGopalSales"
            element={<PrivateRoute element={<MainLayout><AddGopal /></MainLayout>} />}
          />
          <Route
            path="/viewGopalSales"
            element={<PrivateRoute element={<MainLayout><ViewGopal /></MainLayout>} />}
          />
          {/* <Route
            path="/addAyaanSales"
            element={<PrivateRoute element={<MainLayout><ViewMonthlyCons /></MainLayout>} />}
          /> */}
          <Route
            path="/viewAyaanSales"
            element={<PrivateRoute element={<MainLayout><ViewAyaanCinema /></MainLayout>} />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
