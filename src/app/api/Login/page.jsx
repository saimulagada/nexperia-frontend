"use client";
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { NextResponse } from 'next/server';



const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("https://nexperia-code-challenge-2uad.onrender.com/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Save the JWT token to localStorage (or sessionStorage if you prefer)
        localStorage.setItem("accessToken", data.access_token);
       

        // Redirect the user to the homepage/dashboard after successful login
        
       

     
        alert("LogIn Successful");
        router.push("/");
        return response;
      } else {
        const data = await response.json();
        setError(data?.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleRegisterRedirect = () => {
    // Redirect to the register page
    router.push("/api/Register");
  };

  return (
    <Box sx={{ maxWidth: "400px", margin: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        Login
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
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
          Login
        </Button>
      </form>

      {/* Button to navigate to the Register page */}
      <Button
        onClick={handleRegisterRedirect}
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
      >
        Not registered? Register here
      </Button>
    </Box>
  );
};

export default Login;
