import React, { useState } from 'react';

const ReinstatedTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item =>
    item.Reinstated_Policy.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by ID"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          marginBottom: '12px',
          padding: '8px',
          width: '100%',
          boxSizing: 'border-box',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '16px',
        }}
      />

      {/* Table */}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Count</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: '12px', textAlign: 'center', color: '#555' }}>
                No results found
              </td>
            </tr>
          ) : (
            filteredData.map(item => (
              <tr key={item.Reinstated_Policy}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.Reinstated_Policy}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.Count}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReinstatedTable;
