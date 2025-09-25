import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AdminDashboard from './components/Dashboard';

const App = ()=>{
  return(
      <Routes>
        <Route path="*" element= {<AdminDashboard/>}/>
      </Routes>

  )


}
export default App;