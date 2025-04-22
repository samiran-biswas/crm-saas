import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; 
import Login from './auth/Login';
import Register from './auth/Register';
import UniversalDashboard from './pages/Dashboard/UniversalDashboard';
import FormViewerWithAI from './pages/Dashboard/FormViewerWithAI';

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isAuthenticated = true; // For testing

  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <Routes>
          {/* Public Routes */}
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            // Use UniversalDashboard for authenticated routes
            <>
              <Route
                path="/*"
                element={<UniversalDashboard collapsed={collapsed} setCollapsed={setCollapsed} />}
              />
            </>
          )}

          {/* Public Route for Form Viewer with AI */}
          <Route path="/form/:formId" exact element={<FormViewerWithAI />} />
          
          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DndProvider>
    </Router>
  );
};

export default App;

// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Layout } from 'antd';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend'; 
// import AppHeader from './components/Header';
// import Sidebar from './components/Sidebar';
// import Login from './auth/Login';
// import Register from './auth/Register';
// import Dashboard from './pages/Dashboard/Dashboard';
// import Leads from './pages/Dashboard/Leads';
// import Customers from './pages/Dashboard/Customers';
// import Tickets from './pages/Dashboard/Tickets';

// import Meetings from './pages/Dashboard/Meetings';
// import Settings from './pages/Dashboard/Settings';
// import Employees from './pages/Dashboard/Employees';
// import Invoices from './pages/Dashboard/Invoices';
// import Quotations from './pages/Dashboard/Quotations';
// import TaskManagement from './pages/Dashboard/TaskManagement';
// import CallRecords from './pages/Dashboard/CallRecords';
// import SalesPipeline from './pages/Dashboard/SalesPipeline';
// import DocumentManagement from './pages/Dashboard/DocumentManagement';
// import ActivityLog from './pages/Dashboard/ActivityLog';
// import ProfilePage from './pages/Dashboard/ProfilePage';
// import FormBuilderWithKYC from './pages/Dashboard/FormBuilderWithKYC';
// import FormViewerWithAI from './pages/Dashboard/FormViewerWithAI';
// const { Content } = Layout;

// const App = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const isAuthenticated = true; // For testing

//   return (
//     <Router>
//           <DndProvider backend={HTML5Backend}>
//       <Layout style={{ minHeight: '100vh' }}>
//         {isAuthenticated && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
//         <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
//           {isAuthenticated && <AppHeader />}
//           <Content style={{ padding: '20px' }}>
//             <Routes>
//               {!isAuthenticated ? (
//                 <>
//                   <Route path="/login" element={<Login />} />
//                   <Route path="/register" element={<Register />} />
//                   <Route path="*" element={<Navigate to="/login" replace />} />
//                 </>
//               ) : (
//                 <>
//                   <Route path="/" element={<Dashboard />} />
//                   <Route path="/leads" element={<Leads />} />
//                   <Route path="/customers" element={<Customers />} />
//                   <Route path="/employees" element={<Employees />} />
//                   <Route path="/invoices" element={<Invoices />} />
//                   <Route path="/quotations" element={<Quotations />} />
//                   <Route path="/task-management" element={<TaskManagement />} />
//                   <Route path="/settings" element={<Settings />} />
//                   <Route path="/meetings" element={<Meetings />} />
//                   <Route path="/call-records" element={<CallRecords />} />
//                   <Route path="/sales-pipeline" element={<SalesPipeline />} />
//                   <Route path="/document-management" element={<DocumentManagement />} />
//                   <Route path="/activity-log" element={<ActivityLog />} />
//                   <Route path="/profile" element={<ProfilePage />} />
//                   <Route path="/form-builder" element={<FormBuilderWithKYC />} />


//                   <Route path="/form/:formId" exact element={<FormViewerWithAI />} />

//                   <Route path="/tickets" element={<Tickets />} />
                 
//                   <Route path="*" element={<Navigate to="/" replace />} />
//                 </>
//               )}
//             </Routes>
//           </Content>
//         </Layout>
//       </Layout>

//       </DndProvider>

//     </Router>
//   );
// };

// export default App;
