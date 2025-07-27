'use client'
import { useState } from "react";
import { TextField, Button, Box, Typography, Paper, Stack } from "@mui/material";

export default function Register() {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("User registered successfully!");
                setUser({ name: "", email: "", password: "" });
            } else {
                setMessage(data.error || "Error registering user.");
            }
        } catch {
            setMessage("Error connecting to the server.");
        }
    };

    // Paleta e gradiente global (igual home/layout)
    const color1 = '#234e8c';
    const color2 = '#3d65a5';
    // const color3 = '#577bbe';
    // const color4 = '#7192d6';
    const color5 = '#8ba8ef';
    const gradient = `linear-gradient(90deg, ${color1} 0%, ${color5} 100%)`;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: gradient, py: { xs: 2, md: 6 } }}>
            <Stack alignItems="center" justifyContent="flex-start" sx={{ minHeight: '100vh', width: '100%' }}>
                <Paper elevation={8} sx={{ width: '100%', maxWidth: 400, mx: 'auto', p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: '#f7faff', boxShadow: 8 }}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <Typography variant="h5" align="center" sx={{ color: color1, fontWeight: 800, letterSpacing: 1, mb: 1 }}>Register</Typography>
                        <TextField
                            label="Name"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, letterSpacing: 1, borderRadius: 3, boxShadow: 3, background: gradient, color: color1, '&:hover': { background: color2, color: '#fff', boxShadow: 6 }, transition: 'all 0.2s', }}>
                            Register
                        </Button>
                        {message && (
                            <Typography color={message.includes("successfully") ? "primary" : "error"} align="center">
                                {message}
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Stack>
        </Box>
    );
}