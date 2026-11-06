import { processImage } from "./images";
import { Draft, filename, metadata, readme, slug } from "./reference";
const encoder = new TextEncoder();
// ZIP STORE with CRC32. Photos are already JPEG-compressed; keeping entries
// uncompressed avoids a second copy of a potentially large photo collection.
const crcTable = Uint32Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit++)
    crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  return crc >>> 0;
});
function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of data) crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 255];
  return (crc ^ 0xffffffff) >>> 0;
}
export function zip(files: { name: string; data: Uint8Array }[]): Blob {
  const chunks: BlobPart[] = [];
  const directories: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const crc = crc32(file.data);
    const header = new Uint8Array(30 + name.length);
    const h = new DataView(header.buffer);
    h.setUint32(0, 0x04034b50, true);
    h.setUint16(4, 20, true);
    h.setUint16(6, 0x800, true);
    h.setUint16(12, 33, true);
    h.setUint32(14, crc, true);
    h.setUint32(18, file.data.length, true);
    h.setUint32(22, file.data.length, true);
    h.setUint16(26, name.length, true);
    header.set(name, 30);
    chunks.push(header, file.data as Uint8Array<ArrayBuffer>);
    const dir = new Uint8Array(46 + name.length);
    const d = new DataView(dir.buffer);
    d.setUint32(0, 0x02014b50, true);
    d.setUint16(4, 20, true);
    d.setUint16(6, 20, true);
    d.setUint16(8, 0x800, true);
    d.setUint16(14, 33, true);
    d.setUint32(16, crc, true);
    d.setUint32(20, file.data.length, true);
    d.setUint32(24, file.data.length, true);
    d.setUint16(28, name.length, true);
    d.setUint32(42, offset, true);
    dir.set(name, 46);
    directories.push(dir);
    offset += header.length + file.data.length;
  }
  const size = directories.reduce((n, d) => n + d.length, 0);
  const end = new Uint8Array(22);
  const e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true);
  e.setUint16(8, files.length, true);
  e.setUint16(10, files.length, true);
  e.setUint32(12, size, true);
  e.setUint32(16, offset, true);
  return new Blob([...chunks, ...directories, end], {
    type: "application/zip",
  });
}
export async function exportDraft(draft: Draft) {
  if (!draft.photos.length)
    throw new Error("Tambahkan minimal satu foto sebelum mengunduh paket.");
  const files = [
    {
      name: "manifest.json",
      data: encoder.encode(JSON.stringify(metadata(draft), null, 2)),
    },
    { name: "README.md", data: encoder.encode(readme(draft)) },
  ];
  for (const photo of draft.photos) {
    let source = photo.src;
    if (!source.startsWith("data:image/jpeg")) {
      const original = await fetch(source);
      const blob = await original.blob();
      source = await processImage(
        new File([blob], "legacy-photo", { type: blob.type }),
      );
    }
    const response = await fetch(source);
    files.push({
      name: filename(photo),
      data: new Uint8Array(await response.arrayBuffer()),
    });
  }
  const url = URL.createObjectURL(zip(files));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug(draft.name)}_${draft.id.slice(0, 8)}.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
