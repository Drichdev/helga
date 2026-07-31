import { useEffect, useState } from "react";

export function useImagePreloader(sources: string[]) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(sources.length === 0);

  useEffect(() => {
    if (sources.length === 0) {
      setProgress(100);
      setReady(true);
      return;
    }

    let cancelled = false;
    let loaded = 0;

    const images = sources.map((src) => {
      const img = new Image();
      const onDone = () => {
        if (cancelled) return;
        loaded += 1;
        setProgress(Math.round((loaded / sources.length) * 100));
        if (loaded === sources.length) setReady(true);
      };
      img.onload = onDone;
      img.onerror = onDone;
      img.src = src;
      return img;
    });

    return () => {
      cancelled = true;
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [sources]);

  return { progress, ready };
}
