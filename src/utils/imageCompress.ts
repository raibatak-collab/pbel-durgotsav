/**
 * Compresses an image file client-side using HTML5 Canvas to WebP / JPEG
 * to ensure database payloads stay tiny (< 50 KB) and prevent Supabase egress/ingress bloat.
 */
export async function compressImageFile(
  file: File, 
  maxWidth = 800, 
  maxHeight = 800, 
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG, don't compress through canvas, return data url directly
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        try {
          const dataUrl = canvas.toDataURL("image/webp", quality);
          resolve(dataUrl);
        } catch {
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        }
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
