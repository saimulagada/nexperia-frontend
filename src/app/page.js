"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Input, AppBar, Toolbar, CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import FloatingSignOutButton from "./components/Footer";


const CSVUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("You must be logged in to access this page.");
            router.push("/api/Login");
        } else {
            setLoading(false);
        }
    }, [router]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        setLoadingUpload(true);
        const token = localStorage.getItem("accessToken");
        
        if (!file) {
            setMessage("Please select a file.");
            setLoadingUpload(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("https://nexperia-code-challenge-2uad.onrender.com/upload-csv/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage(response.data.message);
            alert("CSV uploaded and data saved successfully!");
        } catch (error) {
            if (error.response?.status === 401) {
                setMessage("Authentication failed. Please log in again.");
                alert("Authentication failed. Please log in again.");
                localStorage.removeItem("accessToken");
                router.push("/api/Login");
            } else {
                setMessage(error?.response?.data?.error || "An error occurred during CSV upload.");
                alert(error?.response?.data?.error || "Error occurred during CSV upload.");
            }
        } finally {
            setLoadingUpload(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        alert("Logged out successfully.");
        router.push("/api/Login");
    };

    const handleGoToTemplateEditor = () => {
        router.push("/api/TemplateEditor");
    };

    if (loading) {
        return null;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>

            <Header />
            

            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Upload CSV File
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <label htmlFor="upload-file">
                        <Input
                            id="upload-file"
                            type="file"
                            onChange={handleFileChange}
                            sx={{ display: "none" }}
                        />
                        <Button
                            variant="outlined"
                            component="span"
                            sx={{ textTransform: "none" }}
                        >
                            {file ? file.name : "Choose File"}
                        </Button>
                    </label>
                </Box>
                <Button
                    variant="contained"
                    onClick={handleUpload}
                    sx={{ mt: 2 }}
                    disabled={loadingUpload}
                >
                    {loadingUpload ? <CircularProgress size={24} color="inherit" /> : "Upload"}
                </Button>
                {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
            </Box>
            <FloatingSignOutButton />
        </Box>
    );
};

export default CSVUpload;
