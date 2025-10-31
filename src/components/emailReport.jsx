import React from "react";

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Heading,
} from "@react-email/components";

const CountRow = ({ label, count }) => (
  <tr>
    <td style={{ fontWeight: 600, color: "#264653", padding: "8px" }}>
      {label}
    </td>
    <td style={{ fontWeight: "bold", color: "#2a9d8f", padding: "8px" }}>
      {count}
    </td>
  </tr>
);

const EmailReport = ({
  dataFromPlType,
  dataFromPolicy,
  dataFromTier,
  dataFromAgent,
  dataFromMembers,
  dataFromReinstated,
  dataFromPlTypeUrl,
  dataFromAgentUrl,
  dataFromMembersUrl,
  dataFromTierUrl,
  dataFromPolicyUrl,
  dataFromReinstatedUrl,
}) => {
  const getRowStyle = (index) => index % 2 === 0 ? { backgroundColor: "#f9f9f9" } : {};
  return (
     <Html>
       <Head />
       <Body style={{ fontFamily: "Arial, sans-serif", fontSize: 14, color: "#222" }}>
         <Container style={{ margin: "0 auto", padding: 20, maxWidth: 600 }}>
           <Section>
             <Heading style={{ fontSize: 18, marginTop: 20 }}>Agent Chart</Heading>
             {dataFromAgentUrl && <Img src={dataFromAgentUrl} alt="Agent Chart"  />}
 
             <Heading style={{ fontSize: 18, marginTop: 20 }}>Member Chart</Heading>
             {dataFromMembersUrl && <Img src={dataFromMembersUrl} alt="Members Chart"  />}

             <Heading style={{ fontSize: 18, marginTop: 20 }}>Reinstated Chart</Heading>
             {dataFromReinstatedUrl && <Img src={dataFromReinstatedUrl} alt="Reinstated Chart"  />}
             <Heading style={{ color: "#2a9d8f", fontSize: 20, marginBottom: 12 }}>
               Pie-Chart Summary
             </Heading>
             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
               <tbody>
                 <CountRow label="Logged-In Agents" count={dataFromAgent.loggedin_counts} />
                 <CountRow label="Non Logged-In Agents" count={dataFromAgent.nonLoggedin_counts} />
                 <CountRow label="Registered Members" count={dataFromMembers.reg_counts} />
                 <CountRow label="Unregistered Members" count={dataFromMembers.unreg_counts} />
                 <CountRow label="Reinstated Policies" count={dataFromReinstated.total_reinstated} />
                 <CountRow label="Other Policies" count={dataFromReinstated.others[0].count} />
               </tbody>
             </table>
 
             <Heading style={{ fontSize: 18, marginTop: 20 }}>Plan Type Based Chart</Heading>
             {dataFromPlTypeUrl && <Img src={dataFromPlTypeUrl} alt="Plan Type Chart"  />}
 
             <Heading style={{ fontSize: 18, marginTop: 20 }}>Plan Type Enrollment Report</Heading>
             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
               <thead>
                 <tr style={{ backgroundColor: "#264653", color: "#fff" }}>
                   {[
                     "Year",
                     "Limited Med",
                     "Dental",
                     "Medical",
                     "Accident",
                     "Critical",
                     "Hospital",
                     "Vision",
                     "Lifestyle",
                     "Supplemental",
                     "Term Life",
                     "Others",
                   ].map((header) => (
                     <th
                       key={header}
                       style={{
                         padding: 10,
                         border: "1px solid #ddd",
                         textAlign: "left",
                       }}
                     >
                       {header}
                     </th>
                   ))}
                 </tr>
               </thead>
               <tbody>
                 {(Array.isArray(dataFromPlType) ? dataFromPlType : []).map((item, index) => (
                   <tr key={item.year} style={getRowStyle(index)}>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.year}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.limitedmed}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.dental}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.medical}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.accident}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.critical}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.hospital}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.vision}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.lifestyle}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.supplemental}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.term_life}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.others}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
 
             <Heading style={{ fontSize: 18, marginTop: 20 }}>Tier Based chart</Heading>
             {dataFromTierUrl && <Img src={dataFromTierUrl} alt="Tier Chart"  />}
             <Heading style={{ fontSize: 18, marginTop: 20 }}>Tier Enrollment Report</Heading>
             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
               <thead>
                 <tr style={{ backgroundColor: "#264653", color: "#fff" }}>
                   {["Year", "IO Tier", "IC Tier", "IS Tier", "IF Tier"].map((header) => (
                     <th
                       key={header}
                       style={{
                         padding: 10,
                         border: "1px solid #ddd",
                         textAlign: "left",
                       }}
                     >
                       {header}
                     </th>
                   ))}
                 </tr>
               </thead>
               <tbody>
                 {(Array.isArray(dataFromTier) ? dataFromTier : []).map((item, index) => (
                   <tr key={item.year} style={getRowStyle(index)}>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.year}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.IO_tier}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.IC_tier}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.IS_tier}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.IF_tier}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
 
             <Heading style={{ fontSize: 18, marginTop: 20 }}>Policy Status Chart</Heading>
             {dataFromPolicyUrl && <Img src={dataFromPolicyUrl} alt="Policy Chart"  />}
             <Heading style={{ fontSize: 18, marginTop: 20 }}>Policy Status Report</Heading>
             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
               <thead>
                 <tr style={{ backgroundColor: "#264653", color: "#fff" }}>
                   {["Year", "New Policy", "Withdrawn Policy", "Termed Policy", "Reinstated Policy"].map((header) => (
                     <th
                       key={header}
                       style={{
                         padding: 10,
                         border: "1px solid #ddd",
                         textAlign: "left",
                       }}
                     >
                       {header}
                     </th>
                   ))}
                 </tr>
               </thead>
               <tbody>
                 {(Array.isArray(dataFromPolicy) ? dataFromPolicy : []).map((item, index) => (
                   <tr key={item.year} style={getRowStyle(index)}>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.year}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.new_policy}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.withdrawn_policy}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.termed_policy}</td>
                     <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.reinstated_policy}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
 

           </Section>
         </Container>
       </Body>
     </Html>
  );
};

export default EmailReport;
 
  // return (
  //   <div style={{ fontFamily: "Arial, sans-serif", fontSize: 14, color: "#222" }}>
  //     <h2 style={{ color: "#2a9d8f" }}>Pie-Chart Summary</h2>
  //     <div style={{ border: "1px solid #ccc", borderRadius: 0, overflow: "hidden", marginBottom: 20 }}>
  //       <CountRow label="Logged-In Agents" count={dataFromAgent.loggedin_counts} />
  //       <CountRow label="Non Logged-In Agents" count={dataFromAgent.nonLoggedin_counts} />
  //       <CountRow label="Registered Members" count={dataFromMembers.reg_counts} />
  //       <CountRow label="Unregistered Members" count={dataFromMembers.unreg_counts} />
  //       <CountRow label="Reinstated Policies" count={dataFromReinstated.total_reinstated} />
  //       <CountRow label="Other Policies" count={dataFromReinstated.others[0].count} />
  //     </div>

  //     <h3>Plan Type Chart</h3>
  //     {images.plType && <img src={images.plType} alt="Plan Type Chart" style={{ maxWidth: '100%', height: 'auto' }} />}
  //     <h3>Plan Type Enrollment Report</h3>
  //     <table style={tableStyle}>
  //       <thead>
  //         <tr>
  //           {["Year", "Limited Med", "Dental", "Medical", "Accident", "Critical", "Hospital", "Vision", "Lifestyle", "Supplemental", "Term Life", "Others"].map(header => (
  //             <th key={header} style={thStyle}>{header}</th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {(Array.isArray(dataFromPlType) ? dataFromPlType : []).map((item, index) => (
  //           <tr key={item.year} style={getRowStyle(index)}>
  //             <td style={tdStyle}>{item.year}</td>
  //             <td style={tdStyle}>{item.limitedmed}</td>
  //             <td style={tdStyle}>{item.dental}</td>
  //             <td style={tdStyle}>{item.medical}</td>
  //             <td style={tdStyle}>{item.accident}</td>
  //             <td style={tdStyle}>{item.critical}</td>
  //             <td style={tdStyle}>{item.hospital}</td>
  //             <td style={tdStyle}>{item.vision}</td>
  //             <td style={tdStyle}>{item.lifestyle}</td>
  //             <td style={tdStyle}>{item.supplemental}</td>
  //             <td style={tdStyle}>{item.term_life}</td>
  //             <td style={tdStyle}>{item.others}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>

  //     <h3>Agent Chart</h3>
  //     {images.agent && <img src={images.agent} alt="Agent Chart" style={{ maxWidth: '100%', height: 'auto' }} />}

  //     <h3>Member Chart</h3>
  //     {images.members && <img src={images.members} alt="Members Chart" style={{ maxWidth: '100%', height: 'auto' }} />}

  //     <h3>Tier Chart</h3>
  //     {images.tier && <img src={images.tier} alt="Tier Chart" style={{ maxWidth: '100%', height: 'auto' }} />}
  //     <h3>Tier Enrollment Report</h3>
  //     <table style={tableStyle}>
  //       <thead>
  //         <tr>
  //           {["Year", "IO Tier", "IC Tier", "IS Tier", "IF Tier"].map(header => (
  //             <th key={header} style={thStyle}>{header}</th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {(Array.isArray(dataFromTier) ? dataFromTier : []).map((item, index) => (
  //           <tr key={item.year} style={getRowStyle(index)}>
  //             <td style={tdStyle}>{item.year}</td>
  //             <td style={tdStyle}>{item.IO_tier}</td>
  //             <td style={tdStyle}>{item.IC_tier}</td>
  //             <td style={tdStyle}>{item.IS_tier}</td>
  //             <td style={tdStyle}>{item.IF_tier}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>

  //     <h3>Policy Chart</h3>
  //     {images.policy && <img src={images.policy} alt="Policy Chart" style={{ maxWidth: '100%', height: 'auto' }} />}
  //     <h3>Policy Status Report</h3>
  //     <table style={tableStyle}>
  //       <thead>
  //         <tr>
  //           {["Year", "New Policy", "Withdrawn Policy", "Termed Policy", "Reinstated Policy"].map(header => (
  //             <th key={header} style={thStyle}>{header}</th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {(Array.isArray(dataFromPolicy) ? dataFromPolicy : []).map((item, index) => (
  //           <tr key={item.year} style={getRowStyle(index)}>
  //             <td style={tdStyle}>{item.year}</td>
  //             <td style={tdStyle}>{item.new_policy}</td>
  //             <td style={tdStyle}>{item.withdrawn_policy}</td>
  //             <td style={tdStyle}>{item.termed_policy}</td>
  //             <td style={tdStyle}>{item.reinstated_policy}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>

  //     <h3>Reinstated Chart</h3>
  //     {images.reinstated && <img src={images.reinstated} alt="Reinstated Chart" style={{ maxWidth: '100%', height: 'auto' }} />}
  //   </div>
  // );
