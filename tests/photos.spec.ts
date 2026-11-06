import { test, expect, Page } from "@playwright/test";
import { metadata, mainPhoto, filename, readme, Draft } from "../lib/reference";
import { zip } from "../lib/archive";

async function create(page: Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Buat objek baru", exact: true })
    .click();
  await page.getByLabel("Nama objek").fill("Kamera analog");
  await page.getByRole("button", { name: "Lanjut ke persiapan" }).click();
  await page.getByRole("button", { name: "Siap, ambil foto pertama" }).click();
}
async function photo(page: Page) {
  const image = await page.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 48;
    c.getContext("2d")!.fillRect(0, 0, 64, 48);
    return c.toDataURL("image/png").split(",")[1];
  });
  await page
    .locator("input[type=file]")
    .first()
    .setInputFiles({
      name: "photo.png",
      mimeType: "image/png",
      buffer: Buffer.from(image, "base64"),
    });
  await expect(
    page.getByRole("heading", { name: "Sudah terlihat jelas?" }),
  ).toBeVisible();
}
async function reviewWithPhoto(page: Page) {
  await create(page);
  await photo(page);
  await page.getByRole("button", { name: "Gunakan foto" }).click();
  await page.getByRole("button", { name: "Ke review" }).click();
}

test("metadata preserves unknown measurements, filenames, main photo and missing angles", () => {
  const d: Draft = {
    id: "abc",
    name: "../Kamera",
    description: "Contoh",
    updated: 0,
    photos: [
      { angle: 0, src: "test" },
      { angle: 1, src: "test" },
      { angle: 10, src: "test", label: "konektor / USB" },
    ],
    skipped: { 2: "Tidak aman" },
  };
  expect(mainPhoto(d)?.angle).toBe(1);
  expect(mainPhoto({ ...d, mainAngle: 10 })?.angle).toBe(10);
  const m = metadata(d);
  expect(m.dimensions.width).toBeNull();
  expect(m.mainPhoto).toBe("02-front-right.jpg");
  expect(m.skippedAngles).toEqual([{ angle: "Kanan", reason: "Tidak aman" }]);
  expect(m.missingAngles).toHaveLength(7);
  expect(filename(d.photos[2])).toBe("detail-01-konektor-USB.jpg");
  expect(readme(d)).toContain("tidak diketahui");
});
test("ZIP has correct entry signatures and UTF-8 names", async () => {
  const blob = zip([
    { name: "café.txt", data: new TextEncoder().encode("abc") },
  ]);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  expect(new DataView(bytes.buffer).getUint32(0, true)).toBe(0x04034b50);
  expect(new DataView(bytes.buffer).getUint32(bytes.length - 22, true)).toBe(
    0x06054b50,
  );
  // CRC32 of abc is a known fixed vector.
  expect(new DataView(bytes.buffer).getUint32(14, true)).toBe(0x352441c2);
});
test("rejects corrupt images and unsupported files without entering preview", async ({
  page,
}) => {
  await create(page);
  await page
    .locator("input[type=file]")
    .first()
    .setInputFiles({
      name: "broken.png",
      mimeType: "image/png",
      buffer: Buffer.from("not an image"),
    });
  await expect(page.locator(".toast[role=alert]")).toContainText(
    "Isi gambar tidak dapat dibaca",
  );
  await expect(
    page.getByRole("heading", { name: "Depan", exact: true }),
  ).toBeVisible();
  await page
    .locator("input[type=file]")
    .first()
    .setInputFiles({
      name: "fake.heic",
      mimeType: "image/heic",
      buffer: Buffer.from("bad"),
    });
  await expect(page.locator(".toast[role=alert]")).toContainText(
    "JPEG, PNG, atau WebP",
  );
});
test("extra photos, primary photo, metadata and skip reasons survive reload", async ({
  page,
}) => {
  await reviewWithPhoto(page);
  await page.getByRole("button", { name: "Foto detail", exact: true }).click();
  await photo(page);
  await expect(
    page.getByRole("button", { name: "Gunakan foto" }),
  ).toBeDisabled();
  await page.getByLabel("Bagian apa ini?").fill("Konektor USB");
  await page.getByRole("button", { name: "Gunakan foto" }).click();
  await page
    .getByRole("button", { name: "Jadikan Konektor USB foto utama" })
    .click();
  await page.getByRole("button", { name: "Foto bawah", exact: true }).click();
  await photo(page);
  await page.getByRole("button", { name: "Gunakan foto" }).click();
  await page
    .getByRole("button", { name: "Foto Kanan: belum tersedia", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Sudut sulit dijangkau? Lewati sudut ini" })
    .click();
  await page.getByLabel("Alasan melewati sudut").fill("Tidak aman");
  await page.getByRole("button", { name: "Simpan alasan & lanjut" }).click();
  await page.getByText("Ukuran & catatan tambahan").click();
  await page.getByLabel("Lebar (cm)").fill("24");
  await page.getByLabel("Material utama").fill("Logam");
  await page.getByLabel("Catatan objek").fill("Pertahankan goresan");
  await expect(
    page.getByText("Draft tersimpan di perangkat ini.", { exact: false }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: /Kamera analog/ }).click();
  await expect(page.getByText("Konektor USB", { exact: true })).toBeVisible();
  await expect(page.getByText("Dilewati: Tidak aman")).toBeVisible();
  await page.getByText("Ukuran & catatan tambahan").click();
  await expect(page.getByLabel("Lebar (cm)")).toHaveValue("24");
  await expect(page.getByLabel("Material utama")).toHaveValue("Logam");
  await expect(page.getByLabel("Catatan objek")).toHaveValue(
    "Pertahankan goresan",
  );
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Unduh paket referensi (.zip)" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/Kamera-analog_.*\.zip/);
  await download.saveAs("/tmp/sudut-reference-test.zip");
});
test("ZIP completion guides manual handoff and photo deletion requires confirmation", async ({
  page,
}) => {
  await reviewWithPhoto(page);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Unduh paket referensi (.zip)" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.zip$/);
  await expect(
    page.getByRole("heading", { name: "Lanjutkan dengan ZIP Anda." }),
  ).toBeVisible();
  await expect(
    page.getByText("Periksa folder Unduhan browser Anda", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Kembali ke review" }).click();
  await page
    .getByRole("button", { name: "Hapus foto Depan", exact: true })
    .click();
  await page.getByRole("button", { name: "Batal", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Unduh paket referensi (.zip)" }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Hapus foto Depan", exact: true })
    .click();
  await page.getByRole("button", { name: "Ya, hapus" }).click();
  await expect(
    page.getByRole("button", { name: "Unduh paket referensi (.zip)" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Hapus draft ini" }).click();
  await page.getByRole("button", { name: "Ya, hapus" }).click();
  await page.reload();
  await expect(
    page.getByText("Masih kosong. Siap untuk objek pertama?"),
  ).toBeVisible();
});
test("mobile capture and review fit the viewport without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await reviewWithPhoto(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});
test("20-photo limit still allows retakes", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const r = indexedDB.open("sudut-studio", 1);
      r.onupgradeneeded = () =>
        r.result.createObjectStore("drafts", { keyPath: "id" });
      r.onsuccess = () => {
        const d = r.result;
        const tx = d.transaction("drafts", "readwrite");
        tx.objectStore("drafts").put({
          id: "full",
          name: "Full draft",
          description: "",
          updated: 0,
          photos: Array.from({ length: 20 }, (_, angle) => ({
            angle,
            src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
            label: "Detail " + angle,
          })),
        });
        tx.oncomplete = () => {
          d.close();
          resolve();
        };
        tx.onerror = () => reject(tx.error);
      };
    });
  });
  await page.reload();
  await page.getByRole("button", { name: /Full draft/ }).click();
  await expect(
    page.getByRole("button", { name: "Foto detail", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Ganti foto bawah", exact: true }),
  ).toBeEnabled();
});

test("storage quota failure keeps the unsaved warning visible through navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    IDBObjectStore.prototype.put = function () {
      throw new DOMException("No space", "QuotaExceededError");
    };
  });
  await page
    .getByRole("button", { name: "Buat objek baru", exact: true })
    .click();
  await page.getByLabel("Nama objek").fill("Belum tersimpan");
  await page.getByRole("button", { name: "Lanjut ke persiapan" }).click();
  await expect(page.locator(".toast")).toContainText("Draft gagal disimpan");
  await expect(page.locator(".storage-notice")).toContainText(
    "Draft belum tersimpan",
  );
  await page.getByRole("button", { name: "Siap, ambil foto pertama" }).click();
  await expect(page.locator(".storage-notice")).toBeVisible();
});
test("skipped angles clear when a replacement photo is accepted", async ({
  page,
}) => {
  await reviewWithPhoto(page);
  await page
    .getByRole("button", { name: "Foto Kanan: belum tersedia" })
    .click();
  await page
    .getByRole("button", { name: "Sudut sulit dijangkau? Lewati sudut ini" })
    .click();
  await page.getByLabel("Alasan melewati sudut").fill("Terhalang");
  await page.getByRole("button", { name: "Simpan alasan & lanjut" }).click();
  await page
    .getByRole("button", { name: "Foto Kanan: belum tersedia" })
    .click();
  await photo(page);
  await page.getByRole("button", { name: "Gunakan foto" }).click();
  await expect(page.getByText("Dilewati: Terhalang")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Foto Kanan: tersedia", exact: true }),
  ).toBeVisible();
});

test("failed export stays on review and does not claim a package was created", async ({
  page,
}) => {
  await reviewWithPhoto(page);
  await page.evaluate(() => {
    URL.createObjectURL = () => {
      throw new Error("Export unavailable");
    };
  });
  await page
    .getByRole("button", { name: "Unduh paket referensi (.zip)" })
    .click();
  await expect(page.locator(".toast")).toContainText(
    "Paket belum berhasil dibuat",
  );
  await expect(
    page.getByRole("heading", { name: "Setiap sisi, sudah terwakili?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Beranda Sudut" }).click();
  await page.getByRole("button", { name: "Paket dibuat", exact: true }).click();
  await expect(page.getByText("Belum ada paket ZIP dibuat")).toBeVisible();
});
test("package status survives reload and edits require a fresh export", async ({
  page,
}) => {
  await reviewWithPhoto(page);
  await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Unduh paket referensi (.zip)" }).click(),
  ]);
  await page
    .getByRole("heading", { name: "Lanjutkan dengan ZIP Anda." })
    .waitFor();
  await page.reload();
  await page.getByRole("button", { name: "Paket dibuat", exact: true }).click();
  await page.getByRole("button", { name: /Kamera analog/ }).click();
  await page.getByText("Ukuran & catatan tambahan").click();
  await page.getByLabel("Catatan objek").fill("Catatan baru");
  await expect(
    page.getByText("Draft tersimpan di perangkat ini.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Beranda Sudut" }).click();
  await expect(page.getByText("Belum ada paket ZIP dibuat")).toBeVisible();
  await page.getByRole("button", { name: /Belum diekspor/ }).click();
  await expect(
    page.getByRole("button", { name: /Kamera analog/ }),
  ).toBeVisible();
});
