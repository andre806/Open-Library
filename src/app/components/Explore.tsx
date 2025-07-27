"use client";
import { useEffect, useState } from "react";
import { Box, TextField, Autocomplete, Chip, Typography, Card, CardContent, CardActionArea, CircularProgress, Paper, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

type Book = {
    id: number;
    title: string;
    description: string;
    filename: string;
    path: string;
    tags: string[];
};

export default function Explore() {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [search, setSearch] = useState("");
    const [allTags, setAllTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Paleta e gradiente global (igual home/layout)
    const color1 = '#234e8c';
    const color2 = '#3d65a5';
    const color3 = '#577bbe';
    const color4 = '#7192d6';
    const color5 = '#8ba8ef';
    const gradient = `linear-gradient(90deg, ${color1} 0%, ${color5} 100%)`;

    // Busca livros e tags
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const resBooks = await fetch("/api/upload");
            const dataBooks = await resBooks.json();
            setBooks(dataBooks || []);
            setFilteredBooks(dataBooks || []);
            // Busca todas as tags
            const resTags = await fetch("/api/tags");
            const dataTags = await resTags.json();
            setAllTags(
                Array.from(
                    new Set(
                        (dataTags as { name: string }[]).map(tag => String(tag.name).trim().toLowerCase())
                    )
                ).sort() as string[]
            );
            setLoading(false);
        };
        fetchData();
    }, []);

    // Filtra livros ao pesquisar ou selecionar tags
    useEffect(() => {
        let filtered = books;
        if (search.trim()) {
            const s = search.trim().toLowerCase();
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(s) ||
                (book.description && book.description.toLowerCase().includes(s))
            );
        }
        if (selectedTags.length > 0) {
            filtered = filtered.filter(book =>
                selectedTags.every(tag => (book.tags || []).map(t => t.toLowerCase()).includes(tag))
            );
        }
        setFilteredBooks(filtered);
    }, [search, selectedTags, books]);

    const handleBookClick = (book: Book) => {
        // Redireciona para página de preview do PDF
        router.push(`/preview/${book.id}`);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: gradient, py: { xs: 2, md: 6 } }}>
            <Stack alignItems="center" justifyContent="flex-start" sx={{ minHeight: '100vh', width: '100%' }}>
                <Paper elevation={8} sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: '#f7faff', boxShadow: 8 }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ color: color1, fontWeight: 800, letterSpacing: 1, mb: 2 }}>Explore Livros</Typography>
                    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                        <TextField
                            label="Pesquisar livro"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            sx={{ flex: 1, minWidth: 220 }}
                        />
                        <Autocomplete
                            multiple
                            options={allTags}
                            value={selectedTags}
                            onChange={(_, value) => setSelectedTags(value)}
                            renderTags={(value: string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                                ))
                            }
                            renderInput={params => (
                                <TextField {...params} label="Filtrar por categoria" placeholder="Categorias" />
                            )}
                            sx={{ minWidth: 220, flex: 1 }}
                        />
                    </Box>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredBooks.length === 0 ? (
                        <Typography align="center" color="text.secondary" sx={{ mt: 6 }}>
                            Nenhum livro encontrado.
                        </Typography>
                    ) : (
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
                            {filteredBooks.map(book => (
                                <Card key={book.id} sx={{ cursor: "pointer", height: "100%", borderRadius: 3, boxShadow: 4, border: `1.5px solid ${color5}55`, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 10, borderColor: color2 } }}>
                                    <CardActionArea onClick={() => handleBookClick(book)} sx={{ height: "100%" }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ color: color1, fontWeight: 700 }}> {book.title} </Typography>
                                            <Typography variant="body2" color={color3} gutterBottom>
                                                {book.description}
                                            </Typography>
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                                                {(book.tags || []).map(tag => (
                                                    <Chip key={tag} label={tag} size="small" color="primary" />
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Paper>
            </Stack>
        </Box>
    );
}
