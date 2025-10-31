import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react/hooks";
import { useState } from "react";

const DIRECT_LIST = gql`
  query GetDirectList($agent_ga: Int!) {
    directList(agent_ga: $agent_ga) {
      First_Name
      Last_Name
      Email
      Phone
      State
      Level
      active_count
      withdrawn_count
      termed_count
    }
  }
`;
const DirectList = () => {
  const [agentGaInput, setAgentGaInput] = useState("");
  const [runQuery, { loading, error, data }] = useLazyQuery(DIRECT_LIST);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (agentGaInput) {
      runQuery({ variables: { agent_ga: parseInt(agentGaInput) } });
    }
  };

  if (loading) return <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', color: '#b91c1c' }}>Error loading data</p>;

  return (
    <>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, textAlign: 'center' }}>
        <input
          type="number"
          placeholder="Enter agent_ga"
          value={agentGaInput}
          onChange={(e) => setAgentGaInput(e.target.value)}
          style={{
            padding: '10px 16px',
            fontSize: '1rem',
            borderRadius: 6,
            border: '1px solid #ccc',
            width: 220,
            maxWidth: '80%',
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: 12,
            padding: '10px 18px',
            borderRadius: 6,
            backgroundColor: '#1f2937', // dark gray
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#111827'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1f2937'}
        >
          Fetch List
        </button>
      </form>

      {data?.directList && (
        <table
          style={{
            width: '90%',
            margin: 'auto',
            borderCollapse: 'separate',
            borderSpacing: '0 12px',
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
            fontSize: '0.9rem',
            color: '#1e293b',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#e2e8f0' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', borderRadius: '8px 0 0 8px' }}>
                Downlines
              </th>
              <th style={{ padding: '14px 20px', textAlign: 'left', borderRadius: '0 8px 8px 0' }}>
                Policy Counts
              </th>
            </tr>
          </thead>
          <tbody>
            {data.directList.map((agent, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 4px rgb(0 0 0 / 0.1)',
                }}
              >
                <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: '600', marginBottom: 6 }}>
                    {agent.First_Name} {agent.Last_Name}
                  </div>
                  <div style={{ color: '#475569', marginBottom: 4 }}>{agent.State}</div>
                  <div style={{ color: '#475569', marginBottom: 4 }}>{agent.Email}</div>
                  <div style={{ color: '#475569', marginBottom: 8 }}>{agent.Phone}</div>
                  <div>
                    <strong>Level:</strong> {agent.Level}
                  </div>
                </td>
                <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                  <div style={{ marginBottom: 6 }}>
                    <strong>Active Count:</strong> {agent.active_count}
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <strong>Withdrawn Count:</strong> {agent.withdrawn_count}
                  </div>
                  <div>
                    <strong>Termed Count:</strong> {agent.termed_count}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default DirectList;
