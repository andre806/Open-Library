"use client";
import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Autocomplete,
    Chip,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    CircularProgress,
    Paper,
    Stack,
    InputAdornment,
    Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
    const [fetchError, setFetchError] = useState<string | null>(null);

    const router = useRouter();

    // Global palette and gradient (same as home/layout)
    const color1 = "#234e8c";
    const color2 = "#3d65a5";
    const color3 = "#577bbe";
    const color5 = "#8ba8ef";
    const gradient = `linear-gradient(90deg, ${color1} 0%, ${color5} 100%)`;

    // Fetch books and tags with error handling
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setFetchError(null);
            try {
                const resBooks = await fetch("/api/upload");
                if (!resBooks.ok) throw new Error("Erro ao buscar livros.");
                const dataBooks = await resBooks.json();
                setBooks(dataBooks || []);
                setFilteredBooks(dataBooks || []);

                // Fetch all tags
                const resTags = await fetch("/api/tags");
                if (!resTags.ok) throw new Error("Erro ao buscar categorias.");
                const dataTags = await resTags.json();
                setAllTags(
                    Array.from(
                        new Set(
                            (dataTags as { name: string }[])
                                .filter((tag) => tag && tag.name != null && tag.name !== undefined)
                                .map((tag) => String(tag.name).trim().toLowerCase())
                                .filter((tag) => tag !== "")
                        )
                    ).sort() as string[]
                );
            } catch (error: unknown) {
                let errorMessage = "Erro desconhecido ao buscar dados.";
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }
                setFetchError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter books when searching or selecting tags
    useEffect(() => {
        let filtered = books;

        if (search.trim()) {
            const s = search.trim().toLowerCase();
            filtered = filtered.filter(
                (book) =>
                    book.title?.toLowerCase().includes(s) ||
                    (book.description && book.description.toLowerCase().includes(s))
            );
        }

        if (selectedTags.length > 0) {
            // Troque `.every` por `.some` para filtro "OU"
            filtered = filtered.filter((book) =>
                selectedTags
                    .filter((tag) => tag != null && tag !== undefined && tag !== "")
                    .some((tag) =>
                        (book.tags || [])
                            .filter((t) => t != null && t !== undefined && t !== "")
                            .map((t) => String(t).toLowerCase())
                            .includes(String(tag).toLowerCase())
                    )
            );
        }
        setFilteredBooks(filtered);
    }, [search, selectedTags, books]);

    const handleBookClick = (book: Book) => {
        // Redirect to PDF preview page
        router.push(`/preview/${book.id}`);
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: gradient, py: { xs: 2, md: 6 } }}>
            <Stack alignItems="center" justifyContent="flex-start" sx={{ minHeight: "100vh", width: "100%" }}>
                <Paper
                    elevation={8}
                    sx={{
                        width: "100%",
                        maxWidth: 900,
                        mx: "auto",
                        p: { xs: 2, md: 4 },
                        borderRadius: 4,
                        bgcolor: "#f7faff",
                        boxShadow: 8,
                    }}
                >
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{
                            color: color1,
                            fontWeight: 800,
                            letterSpacing: 1,
                            mb: 2,
                            userSelect: "none",
                        }}
                    >
                        Explore Books
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                        <TextField
                            label="Buscar livro"
                            aria-label="Buscar livro"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ flex: 1, minWidth: 220 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Autocomplete
                            multiple
                            options={allTags}
                            value={selectedTags}
                            onChange={(_, value) => setSelectedTags(value)}
                            renderTags={(value: string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip
                                        variant="filled"
                                        label={option}
                                        {...getTagProps({ index })}
                                        key={option}
                                        color="primary"
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="Filtrar por categoria" placeholder="Categorias" aria-label="Filtrar por categoria" />
                            )}
                            sx={{ minWidth: 220, flex: 1 }}
                        />
                    </Box>

                    {/* Feedback de busca */}
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        {filteredBooks.length} resultado(s) encontrado(s)
                    </Typography>

                    {/* Erro de fetch */}
                    {fetchError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {fetchError}
                        </Alert>
                    )}

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredBooks.length === 0 ? (
                        <Typography align="center" color="text.secondary" sx={{ mt: 6 }}>
                            Nenhum livro encontrado.
                        </Typography>
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                    md: "1fr 1fr 1fr",
                                },
                                gap: 3,
                            }}
                        >
                            {filteredBooks.map((book) => (
                                <Card
                                    key={book.id}
                                    sx={{
                                        cursor: "pointer",
                                        height: "100%",
                                        borderRadius: 3,
                                        boxShadow: 4,
                                        border: `1.5px solid ${color5}55`,
                                        transition: "box-shadow 0.2s, border-color 0.2s",
                                        "&:hover": { boxShadow: 10, borderColor: color2 },
                                    }}
                                    aria-label={`Visualizar ${book.title}`}
                                >
                                    <CardActionArea onClick={() => handleBookClick(book)} sx={{ height: "100%" }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ color: color1, fontWeight: 700 }}>
                                                {book.title}
                                            </Typography>
                                            <Typography variant="body2" color={color3} gutterBottom>
                                                {book.description}
                                            </Typography>
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                                                {(book.tags || [])
                                                    .filter((tag) => tag && tag.trim() !== "")
                                                    .map((tag) => (
                                                        <Chip key={tag} label={tag} size="small" color="secondary" sx={{ bgcolor: color5, color: "#fff" }} />
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