"use client";

import { Paper, Box } from "@mui/material";
import { useRef, useEffect } from "react";

export default function Ads() {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Carrega o script do AdSense apenas uma vez
    const script = document.createElement("script");
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8358496567202689";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    // Inicializa o bloco de anúncio após o script carregar
    script.onload = () => {
      try {
        // @ts-expect-error AdSense não possui typings para window.adsbygoogle
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // erro ignorado propositalmente
      }
    };
  }, []);

  // Paleta e visual global
  const color1 = '#234e8c';
  const color5 = '#8ba8ef';

  return (
    <Paper elevation={4} sx={{ my: 3, p: 2, borderRadius: 3, bgcolor: '#f7faff', border: `1.5px solid ${color5}55`, boxShadow: 4, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: 90, width: '100%' }}
          data-ad-client="ca-pub-8358496567202689"
          data-ad-slot="3446310393"
          data-ad-format="auto"
          data-full-width-responsive="true"
          ref={adRef}
        />
      </Box>
    </Paper>
  );
}
