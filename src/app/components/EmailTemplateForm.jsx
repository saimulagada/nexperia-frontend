import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import TextEditor from "./TextEditor";

const EmailTemplateForm = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSave = () => {
    console.log("Subject:", subject);
    console.log("Body:", body);
    alert("Template saved successfully!");
  };

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h5">Create Email Template</Typography>
      <TextField
        label="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Typography sx={{ mt: 2 }}>Body</Typography>
      <TextEditor content={body} onChange={setBody} />
      <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
        Save Template
      </Button>
    </Box>
  );
};

export default EmailTemplateForm;
