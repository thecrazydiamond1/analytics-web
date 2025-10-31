/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import NonLoggedInAgentsChart from "./nonLoggedInAgents";
import MembersPieChart from './unRegisteredMembers';
import ReinstatedPieChart from './totalReinstated';
import PolicyStatusLineChart from './policyStatusChart';
import TierBasedLineChart from './tierBasedEnrollments';
import '../index.css';
import PltypeBasedStackedBarChart from './pltypeBasedEnrollment';
import CommonReport from './CommonReport';
import SendEmail from './sendEmail';
import SendExcelMail from './sendExcelMail';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import apiClient from '../../services/apiclient';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


const MainDashboard = () => {
  const [dataFromPlType, setDataFromPlType] = useState('');
  const [dataFromAgent, setDataFromAgent] = useState('');
  const [dataFromMembers, setDataFromMembers] = useState('');
  const [dataFromTier, setDataFromTier] = useState('');
  const [dataFromReinstated, setDataFromReinstated] = useState('');
  const [dataFromPolicy, setDataFromPolicy] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [emailReport, setEmailReport] = useState(false);
  const auth = useAuth()
  const token = localStorage.getItem('accesstoken')

  // Callback to receive data from child
  const handlePlTypeData = (data) => {
    setDataFromPlType(data);
  };
  const handleAgentData = (data) => {
    setDataFromAgent(data);
  };
  const handleMembersData = (data) => {
    setDataFromMembers(data);
  };
  const handleTierData = (data) => {
    setDataFromTier(data);
  };
  const handlePolicyData = (data) => {
    setDataFromPolicy(data);
  };
  const handleReinstatedData = (data) => {
    setDataFromReinstated(data);
  };
  const handleLogout = async () => {
    const response = await axios.post('http://localhost:3000/api/logout', {}, {
      headers: { Authorization: token },
      withCredentials: true 
    });
    if (response.status === 200) {
      auth.logout(token)
      console.log("logged out");
    } else {
      toast.error("Logout error : cannot log out");
    }
  };
    const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxHeight: '80vh',
    overflowY: 'auto',
    maxWidth: '90vw',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    position: 'relative',
  };
  return (
    <>
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.6rem', color: '#222' }}>Dashboard</h1>
        <p style={{ marginTop: '6px', color: '#666', fontSize: '0.95rem' }}>
          Overview of system data and status
        </p>
      </header>
      <div style={{ textAlign: 'end', marginBottom: '20px' }}>
          <button onClick={() => setShowReport(true)} style={{ padding: '6px 12px', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white' }}>
            General Report
          </button>
      </div>
      <div style={{ textAlign: 'end', marginBottom: '20px' }}>
          <button onClick={() => setEmailReport(true)} style={{ padding: '6px 12px', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: 'green', color: 'white' }}>
            Email Report
          </button>
      </div>
    
      <div style={{ textAlign: 'end', marginBottom: '20px' }}>
          <Link to="/directlist" style={{ padding: '6px 12px', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: 'purple', color: 'white', textDecoration:'none', display:'inline-block' }}>
           Direct Downlines
          </Link>
      </div>

      <div style={{ textAlign: 'end', marginBottom: '20px' }}>
          <button onClick={() => handleLogout()} style={{ padding: '6px 12px', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: 'red', color: 'white' }}>
            Logout
          </button>
      </div>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 0, maxWidth: 360, background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.04)' }}>
            <NonLoggedInAgentsChart onSendData={handleAgentData} />
          </div>
          <div style={{ flex: 1, minWidth: 0, maxWidth: 360, background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.04)' }}>
            <MembersPieChart onSendData={handleMembersData}/>
          </div>
          <div style={{ flex: 1, minWidth: 0, maxWidth: 360, background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.04)' }}>
            <ReinstatedPieChart onSendData={handleReinstatedData} />
          </div>
        </div>

  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', alignItems: 'start' }}>
          <div style={{ background: '#fff', padding: 14, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', minHeight: 320 }}>
            <PolicyStatusLineChart onSendData={handlePolicyData}/>
          </div>
        
        

          <div style={{ background: '#fff', padding: 14, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', minHeight: 320 }}>
            <TierBasedLineChart onSendData={handleTierData} />
          </div>

          {/* <div style={{ background: '#fff', padding: 14, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', minHeight: 320 }}>
            <PltypeBasedLineChart/>
          </div> */}

        

          {/* <div style={{ background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 8px 18px rgba(0,0,0,0.05)', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MembersPieChart />
          </div>

          <div style={{ background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 8px 18px rgba(0,0,0,0.05)', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ReinstatedPieChart />
          </div> */}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', alignItems: 'start' }}>

          <div style={{ background: '#fff', padding: 14, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', minHeight: 320 }}>
            <PltypeBasedStackedBarChart onSendData={handlePlTypeData}  />
          </div>

          {/* <div style={{ background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 8px 18px rgba(0,0,0,0.05)', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MembersPieChart />
          </div>

          <div style={{ background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 8px 18px rgba(0,0,0,0.05)', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ReinstatedPieChart />
          </div> */}
        </div>
        {showReport && (
          <div style={overlayStyle} onClick={() => setShowReport(false)}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowReport(false)} style={{ position: 'absolute', top: 10, right: 10 }}>Close</button>
              <CommonReport
              dataFromAgent={dataFromAgent}
              dataFromMembers={dataFromMembers}
              dataFromPlType={dataFromPlType}
              dataFromPolicy={dataFromPolicy}
              dataFromReinstated={dataFromReinstated}
              dataFromTier={dataFromTier}
            />
            </div>
          </div>
        )}
        {emailReport && (
          <div style={overlayStyle} onClick={() => setEmailReport(false)}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
              <button onClick={() => setEmailReport(false)} style={{ position: 'absolute', top: 10, right: 10 }}>Close</button>
              <SendExcelMail/>
            </div>
          </div>
        )}
      </main>
      <ToastContainer position="top-right" autoClose={3000} />

    </div>
    </>
  );
};

export default MainDashboard;