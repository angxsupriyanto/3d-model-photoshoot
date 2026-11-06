// Decode before accepting the file, apply EXIF orientation through the browser,
// and encode a fresh JPEG so no original EXIF/GPS metadata is retained.
export async function processImage(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Pilih gambar JPEG, PNG, atau WebP.");
  if (file.size > 15 * 1024 * 1024)
    throw new Error("Ukuran foto maksimal 15 MB.");
  if (!file.size) throw new Error("File foto kosong. Pilih foto lain.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    try {
      await image.decode();
    } catch {
      throw new Error(
        "Isi gambar tidak dapat dibaca. Ambil ulang atau pilih foto lain.",
      );
    }
    if (!image.naturalWidth || !image.naturalHeight)
      throw new Error("Gambar tidak memiliki ukuran yang valid.");
    if (image.naturalWidth * image.naturalHeight > 60_000_000)
      throw new Error(
        "Resolusi foto terlalu besar. Pilih foto di bawah 60 megapiksel.",
      );
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Browser tidak dapat memproses foto ini.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    const result = canvas.toDataURL("image/jpeg", 0.9);
    if (!result.startsWith("data:image/jpeg"))
      throw new Error("Konversi foto ke JPEG gagal.");
    if ((result.length - result.indexOf(",") - 1) * 0.75 > 15 * 1024 * 1024)
      throw new Error(
        "Hasil JPEG melebihi 15 MB. Pilih foto beresolusi lebih kecil.",
      );
    return result;
  } finally {
    URL.revokeObjectURL(url);
  }
}
