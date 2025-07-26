'use client'
import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Rating, Paper } from "@mui/material";

type FeedbackType = {
  owner: string;
  comment: string;
  stars: number;
};

export default function Feedback() {
  const [feedback, setFeedback] = useState<FeedbackType>({ owner: "", comment: "", stars: 0 });
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Buscar feedbacks ao carregar a página ou após novo envio
  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      setFeedbacks(data || []);
    } catch {
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

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
        fetchFeedbacks(); // Atualiza lista após envio
      } else {
        setMessage(data.error || "Erro ao enviar feedback.");
      }
    } catch {
      setMessage("Erro de conexão.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
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

      {/* Lista de feedbacks */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Feedbacks recentes
        </Typography>
        {feedbacks.length === 0 && (
          <Typography color="text.secondary">Nenhum feedback ainda.</Typography>
        )}
        {feedbacks.map((fb, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography fontWeight="bold">{fb.owner}</Typography>
              <Rating value={fb.stars} readOnly size="small" />
            </Box>
            <Typography>{fb.comment}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}