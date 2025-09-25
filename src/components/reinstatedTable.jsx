const ReinstatedTable = ({ data }) => {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Count</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.Reinstated_Policy}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.Reinstated_Policy}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.Count}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReinstatedTable;
