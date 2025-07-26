"use client";
import { useEffect, useRef } from "react";

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

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", backgroundColor: "rgb(0,0,0)" }}
      data-ad-client="ca-pub-8358496567202689"
      data-ad-slot="3446310393"
      data-ad-format="auto"
      data-full-width-responsive="true"
      ref={adRef}
    />
  );
}
