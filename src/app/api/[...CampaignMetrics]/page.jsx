"use client"; // Ensures this is a client-side component

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import Header from "@/app/components/Header"; // Assuming you have a Header component
import FloatingSignOutButton from "@/app/components/Footer";

const CampaignMetricsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [allCampaigns, setAllCampaigns] = useState([]); // State to hold all campaigns
  const [loading, setLoading] = useState(false); // Initialize loading to false
  const [campaignName, setCampaignName] = useState("");
  const [emailsSent, setEmailsSent] = useState(0);
  const [emailsPending, setEmailsPending] = useState(0);
  const [emailsFailed, setEmailsFailed] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // Success feedback state for Snackbar
  const [viewingAll, setViewingAll] = useState(false); // State to toggle between view modes

  // Function to fetch a specific campaign's metrics
  const fetchMetrics = async (campaignName) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nexperia-code-challenge-2uad.onrender.com/api/campaign-metrics/${campaignName}/`
      );
      if (!response.ok) {
        throw new Error("Campaign not found");
      }
      const data = await response.json();
      setMetrics(data);
      setError(null); // Reset error if data is fetched successfully
    } catch (error) {
      setMetrics(null); // Clear metrics on error
      setError("Error fetching metrics: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all campaigns from the database
  const fetchAllCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://nexperia-code-challenge-2uad.onrender.com/api/campaign-view-set/");
      const data = await response.json();
      setAllCampaigns(data);
    } catch (error) {
      setError("Error fetching campaigns: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect to fetch metrics when campaign name is provided
  useEffect(() => {
    if (campaignName && !viewingAll) {
      fetchMetrics(campaignName);
    }
  }, [campaignName, viewingAll]);

  // Submit form to add a new campaign
  const handleSubmit = async (e) => {
    e.preventDefault();
    const campaignData = {
      campaign_name: campaignName,
      emails_sent: emailsSent,
      emails_pending: emailsPending,
      emails_failed: emailsFailed,
    };

    setLoading(true);
    try {
      const response = await fetch(
        "https://nexperia-code-challenge-2uad.onrender.com/api/campaign-metrics/save/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(campaignData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuccess(true); // Show success feedback
        // Reset form after success
        setCampaignName("");
        setEmailsSent(0);
        setEmailsPending(0);
        setEmailsFailed(0);
        setError(null); // Reset error if successful
      } else {
        setError(data.error || "Failed to add campaign");
      }
    } catch (error) {
      setError("An error occurred while adding the campaign");
    } finally {
      setLoading(false);
    }
  };

  // Toggle between viewing all campaigns and a single campaign's metrics
  const handleViewAllCampaigns = () => {
    setViewingAll(!viewingAll);
    if (!viewingAll) {
      fetchAllCampaigns(); // Fetch all campaigns when toggling to view all
    }
  };

  return (
    <Box>
      <Header />
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Add a New Campaign and View Metrics
        </Typography>

        {/* Campaign Form */}
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            marginBottom: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add Campaign Information
          </Typography>
          {error && (
            <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Campaign Name"
                  variant="outlined"
                  fullWidth
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Emails Sent"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={emailsSent}
                  onChange={(e) => setEmailsSent(Number(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Emails Pending"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={emailsPending}
                  onChange={(e) => setEmailsPending(Number(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Emails Failed"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={emailsFailed}
                  onChange={(e) => setEmailsFailed(Number(e.target.value))}
                  required
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
              {loading ? "Adding Campaign..." : "Add Campaign"}
            </Button>
          </form>
        </Box>

        {/* Displaying Campaign Metrics */}
        {viewingAll ? (
          <Box>
            <Typography variant="h5" gutterBottom>
              All Campaigns
            </Typography>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="50vh"
              >
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {allCampaigns.map((campaign) => (
                  <Grid item xs={12} sm={4} key={campaign.id}>
                    <Card sx={{ padding: 2,backgroundColor:"lightgreen",boxShadow:"3px 3px 5px black"}}>
                      <CardContent>
                        <Typography sx={{color:"blue"}} variant="h6">{campaign.campaign_name}</Typography>
                        <Typography variant="body1">
                          Emails Sent: {campaign.emails_sent}
                        </Typography>
                        <Typography variant="body1">
                          Emails Pending: {campaign.emails_pending}
                        </Typography>
                        <Typography variant="body1">
                          Emails Failed: {campaign.emails_failed}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        ) : loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          metrics && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Campaign Metrics for "{metrics.campaign_name}"
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ padding: 2 }}>
                    <CardContent>
                      <Typography variant="h6">Emails Sent</Typography>
                      <Typography variant="h5">{metrics.emails_sent}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Card sx={{ padding: 2 }}>
                    <CardContent>
                      <Typography variant="h6">Emails Pending</Typography>
                      <Typography variant="h5">{metrics.emails_pending}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Card sx={{ padding: 2 }}>
                    <CardContent>
                      <Typography variant="h6">Emails Failed</Typography>
                      <Typography variant="h5">{metrics.emails_failed}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  Last updated: {new Date(metrics.last_updated).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )
        )}

        {/* Button to View All Campaigns */}
        <Box sx={{ marginTop: 3 }}>
          <Button
            variant="outlined"
            onClick={handleViewAllCampaigns}
            sx={{ marginRight: 2 }}
          >
            {viewingAll ? "View Single Campaign" : "View All Campaigns"}
          </Button>
        </Box>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Campaign added successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <FloatingSignOutButton />
    </Box>
  );
};

export default CampaignMetricsDashboard;
