/* eslint-disable no-unused-vars */
import React from 'react';
import NonLoggedInAgentsChart from "./nonLoggedInAgents";
import MembersPieChart from './unRegisteredMembers';
import ReinstatedPieChart from './totalReinstated';

const AdminDashboard = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>Dashboard</h1>
        <p style={{ marginTop: '8px', color: '#666' }}>
          Overview of system data and status
        </p>
      </header>

      <main   style={{display: 'flex', flexWrap: 'wrap', gap: '320px', justifyContent:'flex-start'}}>
        <NonLoggedInAgentsChart />
        <MembersPieChart/>
        <ReinstatedPieChart/>
      </main>
    </div>
  );
};

export default AdminDashboard;

