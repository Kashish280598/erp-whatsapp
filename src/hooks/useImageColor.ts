import { useEffect, useState } from 'react';
import { Vibrant } from 'node-vibrant/browser';

type Swatches = Record<string, { hex: string; rgb: number[]; bodyTextColor: string }>;

export const useImageColor = (
  imageUrl: string,
  options?: RequestInit
) => {
  const [palette, setPalette] = useState<Swatches | null>(null);

  useEffect(() => {
    if (!imageUrl) return;
    let objectUrl: string;

    (async () => {
      try {
        const res = await fetch(imageUrl, options);
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);

        const vibrant = new Vibrant(objectUrl);
        const pal = await vibrant.getPalette();
        setPalette(pal as Swatches);
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setPalette(null);
    };
  }, [imageUrl, JSON.stringify(options)]);

  return palette;
};
