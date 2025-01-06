"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import FloatingSignOutButton from "@/app/components/Footer";

const SendEmailForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const router = useRouter();

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      alert("Session expired. Please log in again.");
      router.push("/login");
      return null;
    }

    try {
      const response = await fetch("https://nexperia-code-challenge-2uad.onrender.com/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const { access } = await response.json();
        localStorage.setItem("accessToken", access);
        return access;
      } else {
        alert("Session expired. Please log in again.");
        router.push("/login");
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      alert("An error occurred while refreshing the token.");
      router.push("/login");
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !subject || !body || !recipientEmail) {
      alert("Please fill in all the fields.");
      return;
    }

    let accessToken = localStorage.getItem("accessToken");

    // If no access token, attempt to refresh it
    if (!accessToken) {
      accessToken = await refreshToken();
      if (!accessToken) return; // Stop further execution if token refresh failed
    }

    try {
      const response = await fetch("https://nexperia-code-challenge-2uad.onrender.com/api/send-email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Pass the access token here
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          subject: subject,
          body: body,
          recipient_email: recipientEmail,
        }),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
      } else {
        const errorData = await response.json();
        setShowErrorMessage(true);
      }
    } catch (error) {
      setShowErrorMessage(true);
    }
  };

  const handleSendEmail = async () => {
    // You can implement the logic for sending the email here,
    // or redirect to the email send page.
    router.push("/api/TemplateEditor"); // Assuming the `/send-email` page handles the API call.
  };

  const redirectToCSVUploadPage = () => {
    router.push("/"); // Adjust if needed
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar */}
      <Header />

      {/* Email Form */}
      <Box sx={{ p: 4 }}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Recipient Email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          label="Message Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          fullWidth
          variant="outlined"
          multiline
          rows={6}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Send Email
        </Button>

        {/* Success and Error Snackbar */}
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={6000}
          onClose={() => setShowSuccessMessage(false)}
        >
          <Alert
            onClose={() => setShowSuccessMessage(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Email sent successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={showErrorMessage}
          autoHideDuration={6000}
          onClose={() => setShowErrorMessage(false)}
        >
          <Alert
            onClose={() => setShowErrorMessage(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            An error occurred while sending the email.
          </Alert>
        </Snackbar>
      </Box>
      <FloatingSignOutButton />
    </Box>
  );
};

export default SendEmailForm;
