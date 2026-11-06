export type Photo = { angle: number; src: string; label?: string };
export type Draft = {
  id: string;
  name: string;
  description: string;
  photos: Photo[];
  updated: number;
  exportedAt?: number;
  skipped?: Record<number, string>;
  notes?: string;
  dimensions?: Record<string, string>;
  mainAngle?: number;
  material?: string;
  movingParts?: string;
  preservedDetails?: string;
};
export const angles = [
  "Depan",
  "Serong depan kanan",
  "Kanan",
  "Serong belakang kanan",
  "Belakang",
  "Serong belakang kiri",
  "Kiri",
  "Serong depan kiri",
  "Atas",
];
export const fileLabels = [
  "front",
  "front-right",
  "right",
  "back-right",
  "back",
  "back-left",
  "left",
  "front-left",
  "top",
  "bottom",
];
export function labelFor(angle: number) {
  return angles[angle] || (angle === 9 ? "Bawah" : "Detail");
}
export function mainPhoto(draft: Draft) {
  return (
    draft.photos.find((p) => p.angle === draft.mainAngle) ||
    draft.photos.find((p) => p.angle === 1) ||
    draft.photos[0]
  );
}
export function slug(value: string) {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "objek"
  );
}
export function filename(photo: Photo) {
  return photo.angle < 10
    ? `${String(photo.angle + 1).padStart(2, "0")}-${fileLabels[photo.angle]}.jpg`
    : `detail-${String(photo.angle - 9).padStart(2, "0")}-${slug(photo.label || "detail")}.jpg`;
}
export function metadata(draft: Draft) {
  return {
    schemaVersion: 1,
    id: draft.id,
    name: draft.name,
    description: draft.description,
    orientation:
      "Foto depan menetapkan sisi depan. Kanan dan kiri selalu mengacu pada objek.",
    dimensions: {
      unit: "cm",
      width: draft.dimensions?.["Lebar (cm)"] || null,
      depth: draft.dimensions?.["Kedalaman (cm)"] || null,
      height: draft.dimensions?.["Tinggi (cm)"] || null,
    },
    material: draft.material || null,
    movingParts: draft.movingParts || null,
    preservedDetails: draft.preservedDetails || null,
    notes: draft.notes || "",
    mainPhoto: mainPhoto(draft) ? filename(mainPhoto(draft)!) : null,
    photos: draft.photos.map((p) => ({
      file: filename(p),
      angle: labelFor(p.angle),
      description: p.label || "",
    })),
    missingAngles: angles.filter(
      (_, i) => !draft.photos.some((p) => p.angle === i),
    ),
    skippedAngles: Object.entries(draft.skipped || {})
      .filter(([angle]) => !draft.photos.some((p) => p.angle === Number(angle)))
      .map(([angle, reason]) => ({ angle: labelFor(Number(angle)), reason })),
    exportedAt: new Date().toISOString(),
    deliveryStatus: "local-export",
  };
}
export function readme(draft: Draft) {
  const m = metadata(draft);
  return `# ${draft.name}\n\n${draft.description}\n\nID: ${draft.id}\n\n## Orientasi\n${m.orientation}\n\n## Ukuran\nLebar: ${m.dimensions.width ?? "tidak diketahui"}; kedalaman: ${m.dimensions.depth ?? "tidak diketahui"}; tinggi: ${m.dimensions.height ?? "tidak diketahui"} (cm).\n\nMaterial: ${m.material ?? "tidak diketahui"}\nBagian bergerak: ${m.movingParts ?? "tidak diketahui"}\nDetail penting: ${m.preservedDetails ?? "tidak diketahui"}\n\n## Foto utama\n${m.mainPhoto}\n\n## Daftar foto\n${m.photos.map((p) => `- ${p.file}: ${p.angle}${p.description ? " — " + p.description : ""}`).join("\n")}\n\n## Sudut belum tersedia\n${m.missingAngles.join(", ") || "Semua sudut utama tersedia."}\n${m.skippedAngles.map((s) => `- ${s.angle}: ${s.reason}`).join("\n")}\n\n## Catatan\n${draft.notes || "Tidak ada catatan."}\n\n## Instruksi untuk agent\nGunakan img2threejs untuk membangun objek ini sebagai model Three.js prosedural. Gunakan foto utama sebagai referensi awal, lalu foto lainnya untuk memeriksa bentuk, proporsi, dan detail. Ikuti label sudut dan ukuran yang tercatat. Laporkan bagian yang tidak terlihat atau masih perlu diasumsikan.\n\nmanifest.json adalah format pendamping aplikasi, bukan skema internal img2threejs. Paket ini dibuat di perangkat pengguna. Kirim atau unggah ZIP secara manual melalui layanan pilihan Anda; aplikasi tidak mengirimkannya secara otomatis.\n`;
}
