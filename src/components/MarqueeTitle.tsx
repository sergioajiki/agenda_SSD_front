"use client";

import { useEffect, useRef, useState } from "react";
import "./styles/MarqueeTitle.css";

type MarqueeTitleProps = {
  text: string;
};

/**
 * Texto que desliza (efeito letreiro) ao passar o mouse, só quando o
 * conteúdo realmente ultrapassa a largura disponível. A distância do
 * deslize é medida de verdade (não é um valor chutado), então acompanha
 * qualquer redimensionamento da célula.
 *
 * O hover que dispara a animação é herdado do elemento pai (ex.: a classe
 * "meeting-item" em MonthlyView.css) — este componente só cuida da medição
 * e do recorte.
 */
export default function MarqueeTitle({ text }: MarqueeTitleProps) {
  const viewportRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const el = textRef.current;
    if (!viewport || !el) return;

    const measure = () => {
      setDistance(Math.max(0, el.scrollWidth - viewport.clientWidth));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [text]);

  return (
    <span className="marquee-viewport" ref={viewportRef}>
      <span
        ref={textRef}
        className={`marquee-text${distance > 0 ? " marquee-overflow" : ""}`}
        style={
          distance > 0
            ? ({ "--marquee-dist": `-${distance}px` } as React.CSSProperties)
            : undefined
        }
      >
        {text}
      </span>
    </span>
  );
}
