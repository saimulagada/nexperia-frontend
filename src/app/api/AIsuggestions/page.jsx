"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
} from "@mui/material";

import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import FloatingSignOutButton from "@/app/components/Footer";

const EmailSuggestions = () => {
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://nexperia-code-challenge-2uad.onrender.com/api/email-suggestions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestions);
      } else {
        alert(data.error || "Error fetching suggestions");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlecsvupload = () => {
      router.push("/")
  }

  return (
    <Box>
      {/* Navbar */}
      <Header />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Title */}
        <Typography variant="h4" gutterBottom>
          Generate AI-Powered Email Suggestions
        </Typography>

        {/* Description Input */}
        <TextField
          label="Campaign Description"
          placeholder="Enter a short campaign description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Generate Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={fetchSuggestions}
          disabled={loading || !description.trim()}
          sx={{ mb: 4 }}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Suggestions"}
        </Button>

        {/* Suggestions List */}
        {suggestions.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Suggestions:
            </Typography>
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem key={index} divider>
                  <ListItemText primary={suggestion} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Container>
      <FloatingSignOutButton />
    </Box>
  );
};

export default EmailSuggestions;
