import React, { useState } from "react";
import apiClient from "../../services/apiclient";
const SendExcelMail = () => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem('accesstoken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setSending(true);
    setMessage("");
    try {   
      const response = await apiClient.post("/sendemail", {
        headers: { "Content-Type": "application/json"},
        to: email, 
        token: token,
    
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
            width: "90%",
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
            width: "40%",
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

export default SendExcelMail;
