"use client";

import React, { useState, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    Box,
    Button,
    Select,
    MenuItem,
    AppBar,
    Toolbar,
    Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import FloatingSignOutButton from "@/app/components/Footer";

const placeholders = [
    { label: "First Name", value: "firstname" },
    { label: "Last Name", value: "lastname" },
    { label: "Subject", value: "subject" },
    { label: "Body", value: "body" },
];

const TemplateEditor = () => {
    const [selectedPlaceholder, setSelectedPlaceholder] = useState("");
    const router = useRouter();

    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Write your email template here...</p>",
        editorProps: {
            attributes: { class: "focus:outline-none" },
        },
    });

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

    const fetchWithTokenRefresh = async (url, options) => {
        let accessToken = localStorage.getItem("accessToken");
        let response = await fetch(url, {
            ...options,
            headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 401) {
            accessToken = await refreshToken();
            if (accessToken) {
                response = await fetch(url, {
                    ...options,
                    headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
                });
            }
        }

        return response;
    };

    const insertPlaceholder = useCallback(() => {
        if (selectedPlaceholder && editor) {
            const placeholder = `{${selectedPlaceholder}}`; // Insert with curly braces
            editor.commands.insertContent(placeholder);
            setSelectedPlaceholder("");
        }
    }, [selectedPlaceholder, editor]);

    const handleSaveTemplate = async () => {
        const content = editor?.getHTML();
        const firstname = "Default First Name"; // Replace with actual data
        const lastname = "Default Last Name"; // Replace with actual data
        const subject = "Your Subject Here";

        try {
            const response = await fetchWithTokenRefresh("https://nexperia-code-challenge-2uad.onrender.com/api/email-templates/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstname, lastname, subject, body: content }),
            });

            if (response.ok) {
                alert("Template saved successfully!");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.detail || "Could not save template"}`);
            }
        } catch (error) {
            console.error("Error saving template:", error);
            alert("An unexpected error occurred while saving the template.");
        }
    };

    const handleSendEmail = async () => {
        // You can implement the logic for sending the email here, 
        // or redirect to the email send page.
        router.push("/api/sendEmail"); // Assuming the `/send-email` page handles the API call.
    };

    const redirectToCSVUploadPage = () => {
        router.push("/");
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Header />
            <Box sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Create Email Template
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Select
                        value={selectedPlaceholder}
                        onChange={(e) => setSelectedPlaceholder(e.target.value)}
                        displayEmpty
                        sx={{ minWidth: 200, mr: 2 }}
                    >
                        <MenuItem value="" disabled>
                            Insert Placeholder
                        </MenuItem>
                        {placeholders.map(({ label, value }) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button variant="contained" onClick={insertPlaceholder}>
                        Insert Placeholder
                    </Button>
                </Box>

                <Box
                    sx={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "12px",
                        minHeight: "200px",
                        fontSize: "16px",
                        backgroundColor: "#fafafa",
                    }}
                >
                    <EditorContent editor={editor} />
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Button variant="outlined" onClick={handleSaveTemplate}>
                        Save Template
                    </Button>
                </Box>
            </Box>
            <FloatingSignOutButton />
        </Box>
    );
};

export default TemplateEditor;
