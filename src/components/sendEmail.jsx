import React, { useState } from "react";
// import { render } from "@react-email/render";
import EmailReport from "./emailReport";
import chartToJpegBase64 from "./html2canvas";
import { render } from "@react-email/render";
import apiClient from "../../services/apiclient";

const SendEmail = ({
  dataFromPlType,
  dataFromPolicy,
  dataFromTier,
  dataFromAgent,
  dataFromMembers,
  dataFromReinstated,
  dataFromPlTypeSvg,
  dataFromAgentSvg,
  dataFromMembersSvg,
  dataFromTierSvg,
  dataFromPolicySvg,
  dataFromReinstatedSvg,
}) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [urls, setUrls] = React.useState({
        plType: '',
        agent: '',
        members: '',
        tier: '',
        policy: '',
        reinstated: '',
  });
    const [images, setImages] = React.useState({
        plType: '',
        agent: '',
        members: '',
        tier: '',
        policy: '',
        reinstated: '',
  });
  const token = localStorage.getItem('accessToken');


  const uploadImage = async (base64String, originalName) => {
  try {
    const response = await apiClient.post("/saveimg", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
      body: JSON.stringify({ base64Data: base64String, originalName }),
    });
    const data = await response.json();
    return data.url; 
    
  } catch (err) {
    console.error("Image upload failed", err);
    return null;
  }
};

  React.useEffect(() => {
    async function convertSvgs() {
      const [
        plTypeImg,
        agentImg,
        membersImg,
        tierImg,
        policyImg,
        reinstatedImg,
      ] = await Promise.all([
        chartToJpegBase64(dataFromPlTypeSvg),
        chartToJpegBase64(dataFromAgentSvg),
        chartToJpegBase64(dataFromMembersSvg),
        chartToJpegBase64(dataFromTierSvg),
        chartToJpegBase64(dataFromPolicySvg),
        chartToJpegBase64(dataFromReinstatedSvg),
      ]);
    const uploadedUrls = await Promise.all([
      uploadImage(plTypeImg, "plType.jpg"),
      uploadImage(agentImg, "agent.jpg"),
      uploadImage(membersImg, "members.jpg"),
      uploadImage(tierImg, "tier.jpg"),
      uploadImage(policyImg, "policy.jpg"),
      uploadImage(reinstatedImg, "reinstated.jpg"),
    ]);
    setUrls({
      plType: uploadedUrls[0],
      agent: uploadedUrls[1],
      members: uploadedUrls[2],
      tier: uploadedUrls[3],
      policy: uploadedUrls[4],
      reinstated: uploadedUrls[5],
    });
    setImages({
        plType:plTypeImg,
        agent: agentImg,
        members:membersImg,
        tier:tierImg,
        policy:policyImg,
        reinstated:reinstatedImg
    });

    }
   
    convertSvgs();
  }, [dataFromPlTypeSvg, dataFromAgentSvg, dataFromMembersSvg, dataFromTierSvg, dataFromPolicySvg, dataFromReinstatedSvg]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setSending(true);
    setMessage("");
    try {
      const htmlString =await render(
        <EmailReport
          dataFromAgent={dataFromAgent}
          dataFromMembers={dataFromMembers}
          dataFromPlType={dataFromPlType}
          dataFromPolicy={dataFromPolicy}
          dataFromReinstated={dataFromReinstated}
          dataFromTier={dataFromTier}
          dataFromPlTypeUrl={urls.plType}
          dataFromAgentUrl={urls.agent}
          dataFromMembersUrl={urls.members}
          dataFromTierUrl={urls.tier}
          dataFromPolicyUrl={urls.policy}
          dataFromReinstatedUrl={urls.reinstated}
          dataFromPlTypeImg="cid:plType"
          dataFromAgentImg="cid:agent"
          dataFromMembersImg="cid:member"
          dataFromTierImg="cid:tier"
          dataFromPolicyImg="cid:policy"
          dataFromReinstatedImg="cid:reinstated"
        />
      );
      const response = await apiClient.post("/sendemail", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`,},
        body: JSON.stringify({ to: email, html: htmlString,
        attachments: {
          plType: images.plType,
          agent: images.agent,
          members: images.members,
          tier: images.tier,
          policy: images.policy,
          reinstated: images.reinstated
        }
         }),
      });

      if (response.status === 200) {
        setMessage("Email sent successfully!");
        setEmail("");
      } else {
        setMessage("Failed to send email.");
      }
    } catch (error) {
      setMessage("Failed to send email: " + error.message);
    }
    setSending(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" style={{ display: "block", marginBottom: 8 }}>
          Recipient Email:
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: 12,
            fontSize: "14px",
          }}
          disabled={sending}
          required
        />
        <button
          type="submit"
          disabled={sending}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: sending ? "#ccc" : "#2a9d8f",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontSize: "16px",
            cursor: sending ? "not-allowed" : "pointer",
          }}
        >
          {sending ? "Sending..." : "Send Email"}
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: 12,
            color: message.includes("successfully") ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default SendEmail;
