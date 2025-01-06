import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box } from "@mui/material";

const TextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "<p>Start typing...</p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        p: 2,
        mt: 2,
        minHeight: "200px",
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
};

export default TextEditor;
