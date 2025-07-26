import Explore from "./components/Explore";
import { Box, Container, Typography, Button, Grid, Paper, Chip, Stack } from "@mui/material";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Nova paleta de tons azuis (atualizada)
const color1 = '#234e8c';
const color2 = '#3d65a5';
const color3 = '#577bbe';
const color4 = '#7192d6';
const color5 = '#8ba8ef';
const gradient = `linear-gradient(90deg, ${color1} 0%, ${color5} 100%)`;
const bgColor = color4;
const cardBg = '#fff';
const primary = color1;
const secondary = color2;

export default function Home() {
  return (
    <Box sx={{ bgcolor: bgColor, minHeight: '100vh', py: 6 }}>
      {/* Hero Section */}
      <Container maxWidth="md" sx={{ textAlign: 'center', mb: 8 }}>
        <Chip label="Open Library" sx={{ mb: 2, fontWeight: 700, bgcolor: secondary, color: '#fff', fontSize: 18 }} />
        <Typography
          variant="h2"
          fontWeight={800}
          gutterBottom
          sx={{
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Free Digital Library
        </Typography>
        <Typography variant="h5" color={color2} sx={{ mb: 4 }}>
          Find, preview, and download PDF books simply, quickly, and safely.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            size="large"
            href="/pages/register"
            sx={{
              background: gradient,
              color: color1,
              fontWeight: 700,
              px: 4,
              boxShadow: 3,
              '&:hover': { background: color2, color: '#fff' },
            }}
            endIcon={<ArrowForwardIcon />}
          >
            Sign Up
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="/pages/login"
            sx={{
              borderColor: color1,
              color: color1,
              fontWeight: 700,
              px: 4,
              '&:hover': { borderColor: color2, color: color2 },
            }}
          >
            Login
          </Button>
        </Stack>
      </Container>

      {/* Highlights/Statistics */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center',
          }}
        >
          <Box sx={{ flex: '1 1 220px', maxWidth: 320, minWidth: 220 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center', bgcolor: cardBg, border: '1.5px solid #bdbdbd', boxShadow: 3 }}>
              <Typography variant="h4" fontWeight={700} color={color1}>+10,000</Typography>
              <Typography color={color2}>Books available</Typography>
            </Paper>
          </Box>
          <Box sx={{ flex: '1 1 220px', maxWidth: 320, minWidth: 220 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center', bgcolor: cardBg, border: '1.5px solid #bdbdbd', boxShadow: 3 }}>
              <Typography variant="h4" fontWeight={700} color={color2}>100%</Typography>
              <Typography color={color3}>Free access</Typography>
            </Paper>
          </Box>
          <Box sx={{ flex: '1 1 220px', maxWidth: 320, minWidth: 220 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center', bgcolor: cardBg, border: '1.5px solid #bdbdbd', boxShadow: 3 }}>
              <Typography variant="h4" fontWeight={700} color={color1}>PDF</Typography>
              <Typography color={color2}>Preview and download</Typography>
            </Paper>
          </Box>
          <Box sx={{ flex: '1 1 220px', maxWidth: 320, minWidth: 220 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center', bgcolor: cardBg, border: '1.5px solid #bdbdbd', boxShadow: 3 }}>
              <Typography variant="h4" fontWeight={700} color={color2}>Safe</Typography>
              <Typography color={color3}>No intrusive ads</Typography>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Explore Books */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4, color: color1, textAlign: 'center' }}>
          Explore the Library
        </Typography>
        <Explore />
      </Container>

      {/* Final CTA */}
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 6 }}>
        <Paper elevation={6} sx={{ p: 5, borderRadius: 4, background: gradient, color: color1, boxShadow: 6, border: '2px solid #bdbdbd' }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Sign up for free and get unlimited access to thousands of PDF books.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/pages/register"
            sx={{
              background: '#fff',
              color: color1,
              fontWeight: 700,
              px: 4,
              boxShadow: 3,
              '&:hover': { background: color5, color: color2 },
            }}
            endIcon={<ArrowForwardIcon />}
          >
            Create Free Account
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}