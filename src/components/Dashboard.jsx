/* eslint-disable no-unused-vars */
import React from 'react';
import NonLoggedInAgentsChart from "./nonLoggedInAgents";
import MembersPieChart from './unRegisteredMembers';
import ReinstatedPieChart from './totalReinstated';
import PolicyStatusLineChart from './policyStatusChart';
import TierBasedLineChart from './tierBasedEnrollments';

const AdminDashboard = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.6rem', color: '#222' }}>Dashboard</h1>
        <p style={{ marginTop: '6px', color: '#666', fontSize: '0.95rem' }}>
          Overview of system data and status
        </p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 0, maxWidth: 360, background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.04)' }}>
            <NonLoggedInAgentsChart />
          </div>
          <div style={{ flex: 1, minWidth: 0, maxWidth: 360, background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.04)' }}>
            <MembersPieChart />
          </div>
          <div style={{ flex: 1, minWidth: 0, maxWidth: 360, background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.04)' }}>
            <ReinstatedPieChart />
          </div>
        </div>

  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', alignItems: 'start' }}>
          <div style={{ background: '#fff', padding: 14, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', minHeight: 320 }}>
            <PolicyStatusLineChart />
          </div>
        
        

          <div style={{ background: '#fff', padding: 14, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', minHeight: 320 }}>
            <TierBasedLineChart />
          </div>

        

          {/* <div style={{ background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 8px 18px rgba(0,0,0,0.05)', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MembersPieChart />
          </div>

          <div style={{ background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 8px 18px rgba(0,0,0,0.05)', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ReinstatedPieChart />
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;