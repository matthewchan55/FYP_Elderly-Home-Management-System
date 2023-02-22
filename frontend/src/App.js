import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// path
import Login from  './pages/Login'
import Signup from './pages/Signup'
import AdminHome from './pages/AdminHome'
import CaregiversHome from './pages/CaregiversHome'
import RelativesHome from './pages/RelativesHome'
import Profile from './pages/Profile'
import Drawer from './components/Drawer'
import StaffManagement from './pages/managements/ManagementStaff'
import ActivityManagement from './pages/managements/ManagementActivity'
import FacilityManagement from './pages/managements/ManagementFacility'
import FinanceManagement from './pages/managements/ManagementFinance'
import MedicationManagement from './pages/managements/ManagementMedication'
import OthersManagement from './pages/managements/ManagementOthers'
import ResidentsManagement from './pages/managements/ManagementResidents'
import WorkManagement from './pages/managements/ManagementWork'

import { useAuthContext } from './hook/useAuthContext';


function App() {
  
  const {user} = useAuthContext()

  const userHomePage = (type) => {
    switch(type){
      case 'admin':
        return <Drawer main={<AdminHome/>}/>
      case 'caregivers':
        return <Drawer main={<CaregiversHome/>}/>
      case 'relatives':
        return <Drawer main={<RelativesHome/>}/>
      default:
        return <Login/>
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/home" element={user ? userHomePage(user.userType): <Navigate to="/login"/>}></Route>
            <Route path="/login" element={!user? <Login />: <Navigate to="/home"/>} />
            <Route path="/signup" element={!user ? <Signup/>: <Navigate to="/home"/>} />
            <Route path="/profile" element={user? <Drawer main={<Profile/>}/>: <Navigate to="/login"/>}/>
            <Route path="/management/staff" element={user? <Drawer main={<StaffManagement/>}/>: <Navigate to="/login"/>}/>
            <Route path="/management/residents" element={user? <Drawer main={<ResidentsManagement/>}/>: <Navigate to="/login"/>}/>
            <Route path="/management/work" element={user? <Drawer main={<WorkManagement/>}/>: <Navigate to="/login"/>}/>
            <Route path="/management/finance" element={user? <Drawer main={<FinanceManagement/>}/>: <Navigate to="/login"/>}/>
            <Route path="/management/medication" element={user? <Drawer main={<MedicationManagement/>}/>: <Navigate to="/login"/>}/>
            <Route path="/management/activity" element={user? <Drawer main={<ActivityManagement/>}/>: <Navigate to="/login"/>}/>
            <Route path="/management/facility" element={user? <Drawer main={<FacilityManagement/>}/>: <Navigate to="/login"/>}/>
            <Route path="/management/others" element={user? <Drawer main={<OthersManagement/>}/>: <Navigate to="/login"/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
