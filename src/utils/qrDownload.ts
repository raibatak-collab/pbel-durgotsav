/**
 * PBEL City Durgotsav 2026 - High-Compatibility QR Code Downloader & Gallery Saver
 * - Android (Samsung, Pixel, OnePlus, etc.) & Desktop: Performs direct Blob download,
 *   which automatically saves to device storage and immediately appears in Samsung Gallery / Google Photos / Downloads.
 * - iOS (iPhone / iPad): Uses native Web Share API with image file so users can tap "Save Image" to Photos.
 */

export async function saveQrCodeToGallery(
  qrPayload: string,
  amount?: number | string,
  sevaTitle?: string
): Promise<void> {
  const safeName = sevaTitle 
    ? sevaTitle.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 30)
    : amount 
    ? `Rs${amount}` 
    : "General";
    
  const fileName = `PBEL-Durgotsav-QR-${safeName}.png`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(qrPayload)}`;

  try {
    const response = await fetch(qrUrl);
    if (!response.ok) throw new Error("Failed to fetch QR image");
    const blob = await response.blob();

    // Check if running on iOS (iPhone / iPad) where Web Share provides "Save Image" to Camera Roll
    const isIOS = typeof navigator !== "undefined" && (
      /iPad|iPhone|iPod/.test(navigator.userAgent || "") ||
      (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent || ""))
    );

    if (isIOS && navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], fileName, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "PBEL Durgotsav UPI QR",
            text: `PBEL Sanskritik Samiti Seva QR Code${amount ? ` - ₹${amount}` : ""}`,
          });
          return;
        }
      } catch (shareErr: any) {
        if (shareErr?.name === "AbortError") return;
      }
    }

    // Direct Blob Download for Android (Samsung, OnePlus, Xiaomi, Pixel) and PC/Mac browsers
    // Android automatically indexes downloaded image files into the Samsung Gallery / Google Photos.
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    link.setAttribute("style", "display:none;");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);

    // Show confirmation hint for Android / Samsung users
    if (typeof window !== "undefined" && !isIOS) {
      const hint = document.createElement("div");
      hint.className = "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-bounce border border-amber-400/40";
      hint.innerHTML = `<span>✓ QR saved to Gallery / Downloads! Ready to upload in GPay/PhonePe</span>`;
      document.body.appendChild(hint);
      setTimeout(() => hint.remove(), 4000);
    }
  } catch (error) {
    console.error("Direct QR download failed, falling back to direct window.open:", error);
    window.open(qrUrl, "_blank");
  }
}

