"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Chip, Button, CircularProgress, Paper, Stack } from "@mui/material";
import Ads from "@/app/components/ads";
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

  // AdSense bloco
  const [showAds, setShowAds] = useState(false);

  useEffect(() => {
    setShowAds(true);
  }, []);

  useEffect(() => {
    if (!showAds) return;
    const script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8358496567202689";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
    script.onload = () => {
      try {
        // @ts-expect-error AdSense init: necessário para exibir anúncios
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // erro ignorado propositalmente
      }
    };
  }, [showAds]);

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
  const fullPdfUrl =
    book?.path && supabaseUrl
      ? `${supabaseUrl}/storage/v1/object/public/pdfs/${book.path}`
      : "";
  // URL do preview (10 páginas) via API customizada
  const previewUrl = fullPdfUrl
    ? `/api/pdf?url=${encodeURIComponent(fullPdfUrl)}`
    : "";

  // (Removido: coverUrl)

  // Sempre busca o total de páginas via API
  useEffect(() => {
    if (!fullPdfUrl) return;
    const fetchPages = async () => {
      try {
        const res = await fetch(
          `/api/pdf?url=${encodeURIComponent(fullPdfUrl)}&meta=1`
        );
        const data = await res.json();
        if (typeof data.totalPages === "number") setTotalPages(data.totalPages);
        else setTotalPages(null);
      } catch {
        setTotalPages(null);
      }
    };
    fetchPages();
  }, [fullPdfUrl]);

  if (loading)
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  if (!book)
    return (
      <Typography align="center" sx={{ mt: 6 }}>
        Livro não encontrado.
      </Typography>
    );

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
        <Paper elevation={8} sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: '#f7faff', boxShadow: 8 }}>
          {/* Bloco de anúncio AdSense */}
          <Ads />

          <Typography variant="h4" gutterBottom sx={{ color: color1, fontWeight: 800, letterSpacing: 1, mb: 1 }}>
            {book.title}
          </Typography>
          <Typography variant="body2" color={color2} gutterBottom>
            {totalPages !== null ? (
              <>
                Total de páginas: <b>{totalPages}</b>
              </>
            ) : (
              <>
                Total de páginas: <span style={{ color: "#aaa" }}>...</span>
              </>
            )}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: color3, fontWeight: 500 }}>
            {book.description}
          </Typography>
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
              size="large"
              href={fullPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                minWidth: 220,
                mt: 2,
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
              Baixar PDF Completo
            </Button>
          )}
        </Paper>
      </Stack>
    </Box>
  );
}