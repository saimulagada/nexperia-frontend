"use client"; 

import React, { useState } from "react";
import { Button, Snackbar, Alert, Fab, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

const FloatingSignOutButton = () => {
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false); // State for showing the success alert
  const [openDialog, setOpenDialog] = useState(false); // State for controlling the dialog
  const router = useRouter();

  // Function to handle sign out
  const handleSignOut = () => {
    // Clear the token from localStorage (or sessionStorage, based on your setup)
    localStorage.removeItem("accessToken"); // Adjust this key based on your token storage mechanism

    // Show success message
    setShowLogoutSuccess(true);

    // Redirect to login page after the Snackbar is visible for 2 seconds
    setTimeout(() => {
      router.push("/api/Login"); // Redirect to login page
    }, 2000); // Adjust this timeout as needed
  };

  // Function to open the confirmation dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Function to confirm sign out
  const handleConfirmSignOut = () => {
    handleSignOut();
    handleCloseDialog();
  };

  return (
    <div>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="sign out"
        onClick={handleOpenDialog}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          boxShadow: 3,
        }}
      >
        <LogoutIcon />
      </Fab>

      {/* Alert for logout confirmation at the top */}
      <Snackbar
        open={showLogoutSuccess}
        autoHideDuration={2000}
        onClose={() => setShowLogoutSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}  // Position the alert at the top
      >
        <Alert onClose={() => setShowLogoutSuccess(false)} severity="success" sx={{ width: '100%' }}>
          You have logged out successfully!
        </Alert>
      </Snackbar>

      {/* Optional text content */}
      {showLogoutSuccess && (
        <Typography variant="h6" sx={{ position: 'absolute', bottom: 80, right: 16 }}>
          You have been signed out!
        </Typography>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Sign Out</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to sign out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSignOut} color="primary">
            Yes, Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FloatingSignOutButton;
