

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Chip, Button, CircularProgress } from "@mui/material";

type Book = {
  id: number;
  title: string;
  description: string;
  filename: string;
  path: string;
  tags: string[];
};

export default function PreviewPage() {
  const params = useParams();
  const id = params?.id;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // Buscar dados do livro
  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      setLoading(true);
      const res = await fetch(`/api/upload`);
      const data: Book[] = await res.json();
      const found = (data || []).find((b) => String(b.id) === String(id));
      setBook(found || null);
      setLoading(false);
    };
    fetchBook();
  }, [id]);

  // URL pública do PDF no Supabase Storage usando .env
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const fullPdfUrl = book?.path && supabaseUrl
    ? `${supabaseUrl}/storage/v1/object/public/pdfs/${book.path}`
    : "";
  // URL do preview (10 páginas) via API customizada
  const previewUrl = fullPdfUrl ? `/api/pdf?url=${encodeURIComponent(fullPdfUrl)}` : "";

  // Sempre busca o total de páginas via API
  useEffect(() => {
    if (!fullPdfUrl) return;
    const fetchPages = async () => {
      try {
        const res = await fetch(`/api/pdf?url=${encodeURIComponent(fullPdfUrl)}&meta=1`);
        const data = await res.json();
        if (typeof data.totalPages === 'number') setTotalPages(data.totalPages);
        else setTotalPages(null);
      } catch {
        setTotalPages(null);
      }
    };
    fetchPages();
  }, [fullPdfUrl]);

  if (loading) return <Box sx={{ mt: 6, textAlign: "center" }}><CircularProgress /></Box>;
  if (!book) return <Typography align="center" sx={{ mt: 6 }}>Livro não encontrado.</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>{book.title}</Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {totalPages !== null ? (
          <>Total de páginas: <b>{totalPages}</b></>
        ) : (
          <>Total de páginas: <span style={{ color: '#aaa' }}>...</span></>
        )}
      </Typography>
      <Typography variant="body1" gutterBottom>{book.description}</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {(book.tags || []).map((tag: string) => (
          <Chip key={tag} label={tag} color="primary" />
        ))}
      </Box>
      {previewUrl && (
        <Box sx={{ my: 3 }}>
          {!iframeError ? (
            <iframe
              src={previewUrl}
              width="100%"
              height="600px"
              style={{ border: 0, borderRadius: 8 }}
              title="PDF Preview"
              allowFullScreen
              onError={() => setIframeError(true)}
            />
          ) : (
            <Box sx={{ color: "error.main", textAlign: "center", p: 3 }}>
              <Typography variant="h6" color="error" gutterBottom>
                Falha ao carregar o PDF
              </Typography>
              <Typography variant="body2">
                Tente novamente ou baixe o arquivo completo.
              </Typography>
            </Box>
          )}
        </Box>
      )}
      {fullPdfUrl && (
        <Button
          variant="contained"
          color="primary"
          href={fullPdfUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Baixar PDF Completo
        </Button>
      )}
    </Box>
  );
}

