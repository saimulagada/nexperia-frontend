"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleTemplateEditor = () => {
    router.push("/api/TemplateEditor");
  };
  const handlesendEmail = () => {
    router.push("/api/sendEmail");
  };
  const handleAiSuggestions = () => {
    router.push("/api/AIsuggestions");
  };
  const handleCsvUpload = () => {
    router.push("/");
  };
  const handleCampaignMetrics = () => {
    router.push("/api/CampaignMetrics");
  }
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
          AI-Powered App
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={handleCsvUpload}
            variant="contained"
            color="secondary"
            sx={{
              textTransform: "none",
              backgroundColor: "#03a9f4",
              "&:hover": { backgroundColor: "#0288d1" },
            }}
          >
            CSV Upload
          </Button>
         

          <Button
            onClick={handlesendEmail}
            variant="contained"
            color="secondary"
            sx={{
              textTransform: "none",
              backgroundColor: "#8bc34a",
              "&:hover": { backgroundColor: "#7cb342" },
            }}
          >
            Send Email
          </Button>

          <Button
            onClick={handleAiSuggestions}
            variant="contained"
            color="secondary"
            sx={{
              textTransform: "none",
              backgroundColor: "#673ab7",
              "&:hover": { backgroundColor: "#5e35b1" },
            }}
          >
            AI Suggestions
          </Button>
          <Button
            onClick={handleTemplateEditor}
            variant="contained"
            color="secondary"
            sx={{
              textTransform: "none",
              backgroundColor: "#ff5722",
              "&:hover": { backgroundColor: "#e64a19" },
            }}
          >
            Template Editor
          </Button>
          <Button
            onClick={handleCampaignMetrics}
            variant="contained"
            color="secondary"
            sx={{
              textTransform: "none",
              backgroundColor: "#8bc34a",
              "&:hover": { backgroundColor: "#7cb342" },
            }}
          >
            Campaign Metrics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
