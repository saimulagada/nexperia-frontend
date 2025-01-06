"use client";
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useRouter } from "next/navigation";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("https://nexperia-code-challenge-2uad.onrender.com/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response Status:", response.status); // Log status code
      console.log("Response Headers:", response.headers); // Log headers

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/api/Login/'), 2000); // Redirect to login page after 2 seconds
      } else {
        const data = await response.json();
        console.error("Error Response Data:", data); // Log backend response
        setError(data?.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Network Error:", err); // Log network errors
      setError("An error occurred. Please try again.");
    }
  };

  const handleLoginRedirect = () => {
    router.push("/api/Login/");
  };

  return (
    <Box sx={{ maxWidth: "400px", margin: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        Register
      </Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>Registration successful! Redirecting...</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mt: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mt: 2 }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mt: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
      <Button
        onClick={handleLoginRedirect}
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
      >
        Already registered? Login here
      </Button>
    </Box>
  );
};

export default Register;
