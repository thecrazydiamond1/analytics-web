const CountRow = ({ label, count }) => (
  <div style={{ display: "flex", justifyContent: "space-between", margin:"6px", padding: "8px 0", borderBottom: "1px solid #ddd" }}>
    <div style={{ fontWeight: "600", color: "#264653" }}>{label}</div>
    <div style={{ fontWeight: "bold", color: "#2a9d8f" }}>{count}</div>
  </div>
);
const CommonReport = ({
  dataFromPlType,
  dataFromPolicy,
  dataFromTier,
  dataFromAgent,
  dataFromMembers,
  dataFromReinstated,
}) => {

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20,
  };

  const thStyle = {
    backgroundColor: "#264653",
    color: "#fff",
    padding: 10,
    border: "1px solid #ddd",
    textAlign: "left",
  };

  const tdStyle = {
    padding: 10,
    border: "1px solid #ddd",
  };

  const tbodyTrStyle = {
    backgroundColor: "#f9f9f9",
  };

  const tbodyTrHoverStyle = {
    backgroundColor: "#e0f7fa",
  };
  const summaryContainer = {
    border: "1px solid #ccc",
    borderRadius: 0,
    overflow: "hidden",
    marginBottom: 20,
  };

  // For alternating row colors
  const getRowStyle = (index) => {
    return index % 2 === 0 ? tbodyTrStyle : {};
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 14, color: "#222", padding: 20, boxShadow: "0 4px 15px rgba(0,0,0,0.1)", borderRadius: 8, backgroundColor: "#fff" }}>
      <h2 style={{ color: "#2a9d8f" }}>Pie-Chart Data</h2>
      <div style={summaryContainer}>
        <div onMouseEnter={e => e.currentTarget.style.backgroundColor = tbodyTrHoverStyle.backgroundColor}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
        <CountRow label="Logged-In Agents" count={dataFromAgent.loggedin_counts} /></div>
        <div onMouseEnter={e => e.currentTarget.style.backgroundColor = tbodyTrHoverStyle.backgroundColor}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
        <CountRow label="Non Logged-In Agents" count={dataFromAgent.nonLoggedin_counts} /></div>
        <div onMouseEnter={e => e.currentTarget.style.backgroundColor = tbodyTrHoverStyle.backgroundColor}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
        <CountRow label="Registered Members" count={dataFromMembers.reg_counts} /></div>
        <div onMouseEnter={e => e.currentTarget.style.backgroundColor = tbodyTrHoverStyle.backgroundColor}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
        <CountRow label="Unregistered Members" count={dataFromMembers.unreg_counts} /></div>
        <div onMouseEnter={e => e.currentTarget.style.backgroundColor = tbodyTrHoverStyle.backgroundColor}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
        <CountRow label="Reinstated Policies" count={dataFromReinstated.total_reinstated} /></div>
        <div onMouseEnter={e => e.currentTarget.style.backgroundColor = tbodyTrHoverStyle.backgroundColor}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
        <CountRow label="Other Policies" count={dataFromReinstated.others[0].count} /></div>

      </div>
      <h2 style={{ color: "#2a9d8f" }}>Plan Type Enrollment Report</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            {["Year", "Limited Med", "Dental", "Medical", "Accident", "Critical", "Hospital", "Vision", "Lifestyle", "Supplemental", "Term Life", "Others"].map(header => (
              <th key={header} style={thStyle}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {(Array.isArray(dataFromPlType) ? dataFromPlType : []).map((item, index) => (
            <tr
              key={item.year}
              style={{
                ...getRowStyle(index),
                cursor: "pointer",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = tbodyTrHoverStyle.backgroundColor}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = getRowStyle(index).backgroundColor || 'white'}
            >
              <td style={tdStyle}>{item.year}</td>
              <td style={tdStyle}>{item.limitedmed}</td>
              <td style={tdStyle}>{item.dental}</td>
              <td style={tdStyle}>{item.medical}</td>
              <td style={tdStyle}>{item.accident}</td>
              <td style={tdStyle}>{item.critical}</td>
              <td style={tdStyle}>{item.hospital}</td>
              <td style={tdStyle}>{item.vision}</td>
              <td style={tdStyle}>{item.lifestyle}</td>
              <td style={tdStyle}>{item.supplemental}</td>
              <td style={tdStyle}>{item.term_life}</td>
              <td style={tdStyle}>{item.others}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ color: "#2a9d8f", marginTop: 40 }}>Policy Status Report</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            {["Year", "New Policy", "Withdrawn Policy", "Termed Policy", "Reinstated Policy"].map(header => (
              <th key={header} style={thStyle}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(dataFromPolicy) ? dataFromPolicy : []).map((item, index) => (
            <tr
              key={item.year}
              style={{
                ...getRowStyle(index),
                cursor: "pointer",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = tbodyTrHoverStyle.backgroundColor}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = getRowStyle(index).backgroundColor || 'white'}
            >
              <td style={tdStyle}>{item.year}</td>
              <td style={tdStyle}>{item.new_policy}</td>
              <td style={tdStyle}>{item.withdrawn_policy}</td>
              <td style={tdStyle}>{item.termed_policy}</td>
              <td style={tdStyle}>{item.reinstated_policy}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ color: "#2a9d8f", marginTop: 40 }}>Tier Enrollment Report</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            {["Year", "IO Tier", "IC Tier", "IS Tier", "IF Tier"].map(header => (
              <th key={header} style={thStyle}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(dataFromTier) ? dataFromTier : []).map((item, index) => (
            <tr
              key={item.year}
              style={{
                ...getRowStyle(index),
                cursor: "pointer",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = tbodyTrHoverStyle.backgroundColor}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = getRowStyle(index).backgroundColor || 'white'}
            >
              <td style={tdStyle}>{item.year}</td>
              <td style={tdStyle}>{item.IO_tier}</td>
              <td style={tdStyle}>{item.IC_tier}</td>
              <td style={tdStyle}>{item.IS_tier}</td>
              <td style={tdStyle}>{item.IF_tier}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default CommonReport;
