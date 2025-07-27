"use client"

import Explore from "./components/Explore";
import { Box, Container, Typography, Button, Paper, Chip, Stack, Fade, Divider, Tooltip, useMediaQuery, Link as MuiLink } from "@mui/material";
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import NextLink from 'next/link';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box sx={{ bgcolor: bgColor, minHeight: '100vh', py: { xs: 3, md: 6 } }}>
      {/* Hero Section */}
      <Fade in timeout={900}>
        <Container maxWidth="md" sx={{ textAlign: 'center', mb: 8 }}>
          <Chip label="Open Library" sx={{ mb: 2, fontWeight: 700, bgcolor: secondary, color: '#fff', fontSize: 18, letterSpacing: 1.5, boxShadow: 2 }} />
          <Typography
            variant={isMobile ? "h3" : "h2"}
            fontWeight={800}
            gutterBottom
            sx={{
              color: color1,
              mb: 2,
              textShadow: `0 2px 8px ${color5}55`,
              letterSpacing: 1.2,
              transition: 'color 0.3s',
            }}
          >
            Free Digital Library
          </Typography>
          <Typography variant="h5" color={color1} sx={{ mb: 4, opacity: 0.92, fontWeight: 400 }}>
            Find, preview, and download PDF books simply, quickly, and safely.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 2 }}>
            <Tooltip title="Create your free account" arrow>
              <MuiLink component={NextLink} href="/pages/register" underline="none" sx={{ borderRadius: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: gradient,
                    color: color1,
                    fontWeight: 700,
                    px: 4,
                    boxShadow: 3,
                    borderRadius: 3,
                    letterSpacing: 1,
                    textTransform: 'none',
                    '&:hover': { background: color2, color: '#fff', boxShadow: 6 },
                    transition: 'all 0.2s',
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Sign Up
                </Button>
              </MuiLink>
            </Tooltip>
            <Tooltip title="Access your account" arrow>
              <MuiLink component={NextLink} href="/pages/login" underline="none" sx={{ borderRadius: 3 }}>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: color1,
                    color: color1,
                    fontWeight: 700,
                    px: 4,
                    borderRadius: 3,
                    letterSpacing: 1,
                    textTransform: 'none',
                    '&:hover': { borderColor: color2, color: color2, background: color5 },
                    transition: 'all 0.2s',
                  }}
                >
                  Login
                </Button>
              </MuiLink>
            </Tooltip>
            <Tooltip title="Send us your feedback" arrow>
              <MuiLink component={NextLink} href="/pages/feedback" underline="none" sx={{ borderRadius: 3 }}>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: color2,
                    color: color2,
                    fontWeight: 700,
                    px: 4,
                    borderRadius: 3,
                    letterSpacing: 1,
                    textTransform: 'none',
                    boxShadow: 2,
                    '&:hover': { borderColor: color3, color: color3, background: color5 },
                    transition: 'all 0.2s',
                  }}
                >
                  Feedback
                </Button>
              </MuiLink>
            </Tooltip>
            <Tooltip title="Upload a new book" arrow>
              <MuiLink component={NextLink} href="/pages/upload" underline="none" sx={{ borderRadius: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: `linear-gradient(90deg, ${color3} 0%, ${color4} 100%)`,
                    color: '#fff',
                    fontWeight: 800,
                    px: 4,
                    borderRadius: 3,
                    letterSpacing: 1,
                    textTransform: 'none',
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
                  Upload file
                </Button>
              </MuiLink>
            </Tooltip>
          </Stack>
          <Divider sx={{ my: 4, borderColor: color3, opacity: 0.3 }} />
        </Container>
      </Fade>

      {/* Highlights/Statistics */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center" alignItems="stretch" flexWrap="wrap">
          <Fade in timeout={1200}>
            <Paper elevation={6} sx={{ flex: '1 1 220px', minWidth: 220, maxWidth: 320, p: 4, borderRadius: 4, textAlign: 'center', bgcolor: cardBg, border: `2px solid ${color5}`, boxShadow: 4, height: '100%', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 10, borderColor: color2 } }}>
              <Typography variant="h4" fontWeight={700} color={color1} sx={{ mb: 1 }}>+10,000</Typography>
              <Typography color={color2}>Books available</Typography>
            </Paper>
          </Fade>
          <Fade in timeout={1400}>
            <Paper elevation={6} sx={{ flex: '1 1 220px', minWidth: 220, maxWidth: 320, p: 4, borderRadius: 4, textAlign: 'center', bgcolor: cardBg, border: `2px solid ${color4}`, boxShadow: 4, height: '100%', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 10, borderColor: color1 } }}>
              <Typography variant="h4" fontWeight={700} color={color2} sx={{ mb: 1 }}>100%</Typography>
              <Typography color={color3}>Free access</Typography>
            </Paper>
          </Fade>
          <Fade in timeout={1600}>
            <Paper elevation={6} sx={{ flex: '1 1 220px', minWidth: 220, maxWidth: 320, p: 4, borderRadius: 4, textAlign: 'center', bgcolor: cardBg, border: `2px solid ${color3}`, boxShadow: 4, height: '100%', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 10, borderColor: color2 } }}>
              <Typography variant="h4" fontWeight={700} color={color1} sx={{ mb: 1 }}>PDF</Typography>
              <Typography color={color2}>Preview and download</Typography>
            </Paper>
          </Fade>
          <Fade in timeout={1800}>
            <Paper elevation={6} sx={{ flex: '1 1 220px', minWidth: 220, maxWidth: 320, p: 4, borderRadius: 4, textAlign: 'center', bgcolor: cardBg, border: `2px solid ${color2}`, boxShadow: 4, height: '100%', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 10, borderColor: color3 } }}>
              <Typography variant="h4" fontWeight={700} color={color2} sx={{ mb: 1 }}>Safe</Typography>
              <Typography color={color3}>No intrusive ads</Typography>
            </Paper>
          </Fade>
        </Stack>
      </Container>

      {/* Explore Books */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4, color: color1, textAlign: 'center', letterSpacing: 1.1 }}>
          Explore the Library
        </Typography>
        <Paper elevation={3} sx={{ p: { xs: 1, md: 3 }, borderRadius: 4, background: '#f7faff', boxShadow: 2, border: `1.5px solid ${color5}55` }}>
          <Explore />
        </Paper>
      </Container>

      {/* Final CTA */}
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 6 }}>
        <Fade in timeout={1200}>
          <Paper elevation={8} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: gradient, color: color1, boxShadow: 8, border: `2.5px solid ${color2}` }}>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ textShadow: `0 2px 8px ${color5}55` }}>
              Ready to get started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }}>
              Sign up for free and get unlimited access to thousands of PDF books.
            </Typography>
            <MuiLink component={NextLink} href="/pages/register" underline="none" sx={{ borderRadius: 3 }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: '#fff',
                  color: color1,
                  fontWeight: 700,
                  px: 4,
                  borderRadius: 3,
                  boxShadow: 3,
                  letterSpacing: 1,
                  textTransform: 'none',
                  '&:hover': { background: color5, color: color2, boxShadow: 6 },
                  transition: 'all 0.2s',
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Create Free Account
              </Button>
            </MuiLink>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}