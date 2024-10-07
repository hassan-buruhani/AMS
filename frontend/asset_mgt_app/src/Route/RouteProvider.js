import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/dashboard/Home/Home';
import Divisions from '../pages/dashboard/Division/Divisions';
import Maintenance from '../pages/dashboard/Maintenace/Maintenance';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from '../pages/Auth/Login';
import AddOffice from '../pages/dashboard/Office/AddOffice.js';
import UpdateOffice from '../pages/dashboard/Office/UpdateOffice.js';
import Office from '../pages/dashboard/Office/Office.js';
import AssetForm from '../pages/dashboard/Asset/AssetForm';
import DeletedAssets from '../pages/dashboard/Asset/DeletedAssets';
import AssetUpdatedStatsList from '../pages/dashboard/Asset/AssetUpdatedStatsList';
import PendingActions from '../pages/dashboard/Asset/PendingAction.js';
import ActiveAssets from '../pages/dashboard/Asset/ActiveAssets';
import InactiveAssets from '../pages/dashboard/Asset/InactiveAssets';
import AssetList from '../pages/dashboard/Asset/AssetList';
import AssetUpdateForm from '../pages/dashboard/Asset/AssetUpdateForm';
import NewMaintenance from '../pages/dashboard/Maintenace/NewMaintenance';
import MaintenanceUpdate from '../pages/dashboard/Maintenace/MaintenanceUpdate';
import AddDivision from '../pages/dashboard/Division/AddDivision';
import UpdateDivision from '../pages/dashboard/Division/UpdateDivision';
import { AuthProvider } from '../AuthProvider';
import PrivateRoute from '../PrivateRoute';
import UserList from '../pages/dashboard/User/UserList';
import AddUser from '../pages/dashboard/User/AddUser';
import Layout from '../Layout';
import AssetsByDivision from '../pages/dashboard/Asset/AssetsByDivision';
import TroubleshootingAssets from '../pages/dashboard/Maintenace/TroubleshootingAssets';
import ViewUser from '../pages/dashboard/User/ViewUser';
import ForgotPasswordForm from '../pages/Auth/ForgotPasswordForm';
import UpdateUser from '../pages/dashboard/User/UpdateUser';
import ResetPasswordForm from '../pages/Auth/ResetPasswordForm';

function RouteProvider() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* AUTH PROVIDER  TOUTE*/}
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                    <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordForm />} />

                    {/* HOME ROUTES */}
                    <Route path="/" element={<Layout><PrivateRoute><Home /></PrivateRoute></Layout>} />

                    {/* OFFICE ROUTES */}
                    <Route path="/add-Office" element={<Layout><PrivateRoute><AddOffice /></PrivateRoute></Layout>} />
                    <Route path="/update-office/:id" element={<Layout><PrivateRoute><UpdateOffice /></PrivateRoute></Layout>} />
                    <Route path="/office" element={<Layout><PrivateRoute><Office /></PrivateRoute></Layout>} />

                    {/* DIVISION ROUTES */}
                    <Route path="/division" element={<Layout><PrivateRoute><Divisions /></PrivateRoute></Layout>} />
                    <Route path="/add-division" element={<Layout><PrivateRoute><AddDivision /></PrivateRoute></Layout>} />
                    <Route path="/update-division/:id" element={<Layout><PrivateRoute><UpdateDivision /></PrivateRoute></Layout>} />

                    {/* MAINTENANCE ROUTES */}
                    <Route path="/maintenance" element={<Layout><PrivateRoute><Maintenance /></PrivateRoute></Layout>} />
                    <Route path="/new-maintenance" element={<Layout><PrivateRoute><NewMaintenance /></PrivateRoute></Layout>} />
                    <Route path="/update-maintenance/:id" element={<Layout><PrivateRoute><MaintenanceUpdate /></PrivateRoute></Layout>} />
                    <Route path="/assets-by-division/:id" element={<Layout><PrivateRoute><AssetsByDivision /></PrivateRoute></Layout>} />

                    {/* ASSETS ROUTES */}
                    <Route path="/assets" element={<Layout><PrivateRoute><AssetList /></PrivateRoute></Layout>} />
                    <Route path="/add-asset" element={<Layout><PrivateRoute><AssetForm /></PrivateRoute></Layout>} />
                    <Route path="/assets/active-assets" element={<Layout><PrivateRoute><ActiveAssets /></PrivateRoute></Layout>} />
                    <Route path="/assets/inactive/" element={<Layout><PrivateRoute><InactiveAssets /></PrivateRoute></Layout>} />
                    <Route path="/update-asset/:id" element={<Layout><PrivateRoute><AssetUpdateForm /></PrivateRoute></Layout>} />

                    {/* TROUBLESHOTING ROUTES */}
                    <Route path="/troubleshooting-assets" element={<Layout><PrivateRoute><TroubleshootingAssets /></PrivateRoute></Layout>} />

                    {/* USER MANAGEMNE ROUTES */}
                    <Route path="/add-user" element={<Layout><PrivateRoute><AddUser /></PrivateRoute></Layout>} />
                    <Route path="/user-list" element={<Layout><PrivateRoute><UserList /></PrivateRoute></Layout>} />
                    <Route path="/user/:pk" element={<Layout><PrivateRoute><ViewUser /></PrivateRoute></Layout>} />
                    {/* ASSET PENDING MANAGEMENT ROUTES  */}
                    <Route path="/waited-for-approval" element={<Layout><PrivateRoute><PendingActions /></PrivateRoute></Layout>} />
                    <Route path="/update-user/:pk" element={<Layout><PrivateRoute><UpdateUser /></PrivateRoute></Layout>} />
                    <Route path="/assets/deleted" element={<Layout><PrivateRoute><DeletedAssets /></PrivateRoute></Layout>} />
                    <Route path="/assets/updated" element={<Layout><PrivateRoute><AssetUpdatedStatsList /></PrivateRoute></Layout>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default RouteProvider;
