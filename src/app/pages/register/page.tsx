'use client'
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

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

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400, mx: "auto", mt: 5 }}
        >
            <Typography variant="h5" align="center">Register</Typography>
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
            <Button type="submit" variant="contained" color="primary">
                Register
            </Button>
            {message && (
                <Typography color={message.includes("successfully") ? "primary" : "error"} align="center">
                    {message}
                </Typography>
            )}
        </Box>
    );
}