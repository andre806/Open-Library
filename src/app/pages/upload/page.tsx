"use client";
import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Autocomplete, Paper, Stack } from "@mui/material";

export default function Upload() {
    const [pdf, setPdf] = useState({
        title: "",
        description: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [existingTags, setExistingTags] = useState<string[]>([]);

    // Busca as tags existentes da API
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch("/api/tags");
                if (res.ok) {
                    const data = await res.json();
                    setExistingTags(
                        Array.from(
                            new Set((data as { name: string }[]).map(tag => String(tag.name).trim().toLowerCase()))
                        ).sort() as string[]
                    );
                }
            } catch {
                // Ignora erro silenciosamente
            }
        };
        fetchTags();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPdf({ ...pdf, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPdf(prev => ({
                ...prev,
                title: selectedFile.name.replace(/\.pdf$/i, "")
            }));
        }
    };

    const handleSelectTags = (_: React.SyntheticEvent<Element, Event>, value: string[]) => {
        setSelectedTags(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        if (!file) {
            setMessage("Please select a PDF file.");
            return;
        }
        try {
            const allTags = Array.from(new Set([...tags, ...selectedTags].map(t => t.trim().toLowerCase())));
            const existingTagsLower = existingTags.map(t => t.trim().toLowerCase());
            const newTags = allTags.filter(tag => !existingTagsLower.includes(tag));
            if (newTags.length > 0) {
                await fetch("/api/tags", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tags: newTags }),
                });
                setExistingTags(prev => Array.from(new Set([...prev, ...newTags])));
            }

            const formData = new FormData();
            const safeFileName = file.name
                .toLowerCase()
                .replace(/[^a-z0-9.]+/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
            const safeFile = new File([file], safeFileName, { type: file.type });
            formData.append("file", safeFile);
            formData.append("title", pdf.title);
            formData.append("description", pdf.description);
            formData.append("tags", JSON.stringify(allTags));

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("PDF uploaded successfully!");
                setPdf({ title: "", description: "" });
                setFile(null);
                setTags([]);
                setSelectedTags([]);
            } else {
                setMessage(data.error || "Error uploading PDF.");
            }
        } catch {
            setMessage("Error connecting to the server.");
        }
    };

    // Paleta e gradiente global (igual home/layout)
    const color1 = '#234e8c';
    const color2 = '#3d65a5';
    const color3 = '#577bbe';
    const color4 = '#7192d6';
    const color5 = '#8ba8ef';
    const gradient = `linear-gradient(90deg, ${color1} 0%, ${color5} 100%)`;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: gradient, py: { xs: 2, md: 6 } }}>
            <Stack alignItems="center" justifyContent="flex-start" sx={{ minHeight: '100vh', width: '100%' }}>
                <Paper elevation={8} sx={{ width: '100%', maxWidth: 500, mx: 'auto', p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: '#f7faff', boxShadow: 8 }}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <Typography variant="h5" align="center" sx={{ color: color1, fontWeight: 800, letterSpacing: 1, mb: 1 }}>Upload PDF</Typography>
                        <TextField
                            label="Title"
                            name="title"
                            value={pdf.title}
                            InputProps={{ readOnly: true }}
                            sx={{ background: "#f5f5f5" }}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={pdf.description}
                            onChange={handleChange}
                            multiline
                            rows={2}
                        />
                        <Autocomplete
                            multiple
                            options={existingTags}
                            value={selectedTags}
                            onChange={handleSelectTags}
                            renderInput={(params) => (
                                <TextField {...params} label="Select Existing Tags" placeholder="Tags" name="existingTags" />
                            )}
                        />
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                background: `linear-gradient(90deg, ${color3} 0%, ${color4} 100%)`,
                                color: '#fff',
                                fontWeight: 800,
                                borderRadius: 3,
                                letterSpacing: 1,
                                boxShadow: 4,
                                border: `2.5px solid ${color3}`,
                                outline: `2px solid ${color4}`,
                                outlineOffset: '2px',
                                filter: 'drop-shadow(0 2px 8px #7192d655)',
                                transition: 'all 0.18s',
                                '&:hover': {
                                    background: color4,
                                    color: color1,
                                    borderColor: color2,
                                    boxShadow: 8,
                                    outline: `2.5px solid ${color2}`,
                                    filter: 'drop-shadow(0 4px 16px #234e8c33)',
                                },
                            }}
                        >
                            Select PDF
                            <input
                                type="file"
                                accept="application/pdf"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                        {file && <Typography variant="body2">Selected: {file.name}</Typography>}
                        <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, letterSpacing: 1, borderRadius: 3, boxShadow: 3, background: gradient, color: color1, '&:hover': { background: color2, color: '#fff', boxShadow: 6 }, transition: 'all 0.2s', }}>
                            Upload
                        </Button>
                        {message && (
                            <Typography color={message.includes("success") ? "primary" : "error"} align="center">
                                {message}
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Stack>
        </Box>
    );
}