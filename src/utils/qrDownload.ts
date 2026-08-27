/**
 * PBEL City Durgotsav 2026 - High-Compatibility QR Code Downloader
 * Supports:
 * - Native iOS & Android "Save Image to Photos/Gallery" via Web Share API (File Share)
 * - Same-Origin Blob Download for Desktop & Mobile Browsers
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

    // 1. Try Mobile Web Share API with File (Native iOS Save to Photos & Android Save to Gallery)
    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], fileName, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "PBEL Durgotsav UPI QR",
            text: `PBEL Sanskritik Samiti Seva QR Code${amount ? ` - ?${amount}` : ""}`,
          });
          return;
        }
      } catch (shareErr) {
        // User cancelled or share dismissed, proceed to direct download fallback
        if ((shareErr as any)?.name === "AbortError") return;
      }
    }

    // 2. Blob Download Fallback (Forces direct image download rather than cross-origin navigation)
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    link.setAttribute("style", "display:none;");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
  } catch (error) {
    console.error("Direct QR download failed, falling back to window.open:", error);
    // 3. Last-resort fallback: open image directly
    window.open(qrUrl, "_blank");
  }
}
