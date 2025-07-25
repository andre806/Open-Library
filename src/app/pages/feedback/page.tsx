'use client'
import { useState } from "react";
import { Box, Button, TextField, Typography, Rating } from "@mui/material";

export default function Feedback() {
    const [feedback, setFeedback] = useState({ owner: "", comment: "", stars: 0 });
    const [message, setMessage] = useState("");
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFeedback({ ...feedback, [e.target.name]: e.target.value });
    };

    const handleStars = (_: React.SyntheticEvent<Element, Event>, value: number | null) => {
        setFeedback({ ...feedback, stars: value || 0 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        if (!token) {
            setMessage("Você precisa estar logado para enviar feedback.");
            return;
        }
        let owner = feedback.owner;
        try {
            // Decodifica o token para pegar o nome/email do usuário
            const payload = JSON.parse(atob(token.split(".")[1]));
            owner = payload.name || payload.email || "Usuário autenticado";
        } catch {
            owner = "Usuário autenticado";
        }
        const payload = { ...feedback, owner };
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Feedback enviado com sucesso!");
                setFeedback({ owner: "", comment: "", stars: 0 });
            } else {
                setMessage(data.error || "Erro ao enviar feedback.");
            }
        } catch {
            setMessage("Erro de conexão.");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 400,
                mx: "auto",
                mt: 6,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 3,
                border: "1px solid #eee",
                borderRadius: 2,
                boxShadow: 1,
                bgcolor: "#fff",
            }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                Enviar Feedback
            </Typography>
            {/* Campo Nome removido, pois só usuários autenticados podem enviar feedback */}
            <TextField
                label="Comentário"
                name="comment"
                value={feedback.comment}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography>Estrelas:</Typography>
                <Rating
                    name="stars"
                    value={feedback.stars}
                    onChange={handleStars}
                    max={5}
                />
            </Box>
            <Button type="submit" variant="contained" color="primary">
                Enviar Feedback
            </Button>
            {message && (
                <Typography color={message.includes("sucesso") ? "success.main" : "error.main"} align="center">
                    {message}
                </Typography>
            )}
        </Box>
    );
}