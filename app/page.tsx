"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Plus,
  Box,
  Camera,
  Check,
  ChevronRight,
  ImagePlus,
  X,
  Sun,
  Layers3,
  CircleHelp,
  ShieldCheck,
  Scan,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Draft, angles, labelFor, mainPhoto } from "../lib/reference";
import { processImage } from "../lib/images";
import { exportDraft } from "../lib/archive";
const instructions = [
  "Tentukan sisi depan objek. Posisikan kamera sejajar dengan bagian tengah objek.",
  "Tampilkan bagian depan dan sisi kanan objek, sekitar 45°.",
  "Foto sisi kanan secara lurus. Pastikan seluruh objek terlihat.",
  "Tampilkan bagian belakang dan sisi kanan objek, sekitar 45°.",
  "Foto bagian belakang secara lurus.",
  "Tampilkan bagian belakang dan sisi kiri objek, sekitar 45°.",
  "Foto sisi kiri secara lurus.",
  "Tampilkan bagian depan dan sisi kiri objek, sekitar 45°.",
  "Foto dari atas jika dapat dijangkau dengan aman.",
  "Balik objek jika aman, lalu foto bagian bawah.",
  "Foto bagian penting dari dekat, misalnya tombol, konektor, roda, atau sambungan.",
];
function Illustration({
  small = false,
  angle = 0,
}: {
  small?: boolean;
  angle?: number;
}) {
  return (
    <svg
      className={small ? "illustration small" : "illustration"}
      viewBox="0 0 640 440"
      fill="none"
      aria-label="Ilustrasi kamera di sekeliling objek"
      role="img"
    >
      <defs>
        <linearGradient id="body" x1="250" y1="130" x2="430" y2="330">
          <stop stopColor="#e6e8d4" />
          <stop offset="1" stopColor="#a4af8b" />
        </linearGradient>
        <linearGradient id="top" x1="270" y1="120" x2="420" y2="240">
          <stop stopColor="#faf9e9" />
          <stop offset="1" stopColor="#d6dcc0" />
        </linearGradient>
        <radialGradient id="shadow">
          <stop stopColor="#72825d" stopOpacity=".28" />
          <stop offset="1" stopColor="#72825d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="337" cy="342" rx="174" ry="43" fill="url(#shadow)" />
      <ellipse
        cx="326"
        cy="281"
        rx="245"
        ry="103"
        stroke="#bdc5a8"
        strokeDasharray="5 7"
        transform="rotate(-13 326 281)"
      />
      <ellipse
        cx="326"
        cy="281"
        rx="194"
        ry="77"
        stroke="#d2d8bf"
        transform="rotate(-13 326 281)"
      />
      <path d="M258 166 363 127 446 176 337 220Z" fill="url(#top)" />
      <path d="m258 166 79 54v118l-79-53Z" fill="#b6c19b" />
      <path d="m337 220 109-44v117l-109 45Z" fill="url(#body)" />
      <path
        d="m258 166 79 54 109-44M337 220v118"
        stroke="#89996e"
        strokeOpacity=".45"
      />
      <path d="m271 178 53 36v86l-53-36Z" fill="#9eac83" />
      <path d="m281 200 31 20v41l-31-20Z" stroke="#dae0c7" strokeWidth="2" />
      <circle cx="297" cy="279" r="5" fill="#d9dfc7" />
      <path d="m355 231 73-29v72l-73 29Z" fill="#d4dac0" />
      <path
        d="m363 243 57-22M363 254l57-22M363 265l57-22M363 276l57-22"
        stroke="#a9b58e"
        strokeWidth="3"
      />
      <path d="m280 160 79-27 52 31-78 29Z" stroke="#b5c09b" />
      <circle cx="147" cy="305" r="21" fill="#f8f8ed" stroke="#c7cfb3" />
      <path
        d="m139 307 6 6 11-13"
        stroke="#5d7447"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="521"
        cy="244"
        r="6"
        fill="#829964"
        stroke="#f5f5e9"
        strokeWidth="4"
      />
      <circle
        cx="298"
        cy="377"
        r="6"
        fill="#829964"
        stroke="#f5f5e9"
        strokeWidth="4"
      />
      <g transform={`rotate(${angle < 8 ? angle * 45 : 0} 326 280)`}>
        <path
          d="m112 196 104 26-42 46Z"
          fill="#7b9451"
          fillOpacity=".08"
          stroke="#a4b782"
          strokeDasharray="4 4"
        />
        <g transform="translate(74 156) rotate(14)">
          <rect x="0" y="12" width="78" height="57" rx="12" fill="#405b32" />
          <path d="M20 12 27 2h26l9 10" fill="#405b32" />
          <circle
            cx="41"
            cy="40"
            r="22"
            fill="#293e24"
            stroke="#aebc93"
            strokeWidth="3"
          />
          <circle cx="41" cy="40" r="13" fill="#738665" />
          <circle cx="45" cy="36" r="5" fill="#adbd98" />
          <rect x="8" y="22" width="10" height="5" rx="2" fill="#ccd5b4" />
        </g>
      </g>
      <g fill="#7a856c" fontFamily="Arial" fontSize="10" letterSpacing="2">
        <text x="271" y="403">
          DEPAN OBJEK
        </text>
        <text x="481" y="189">
          KANAN
        </text>
      </g>
      <path d="m207 354-22-7 8-21" stroke="#829964" strokeWidth="2" />
      <path d="M187 347q-37-17-48-42" stroke="#829964" strokeWidth="2" />
    </svg>
  );
}
function AngleGuide({ angle }: { angle: number }) {
  const rad = ((angle % 8) * Math.PI) / 4;
  const x = 100 + 66 * Math.sin(rad),
    y = 92 + 57 * Math.cos(rad);
  return (
    <svg
      viewBox="0 0 200 170"
      role="img"
      aria-label={`Diagram ${labelFor(angle)}`}
    >
      <ellipse
        cx="100"
        cy="92"
        rx="66"
        ry="57"
        fill="none"
        stroke="#b5c59f"
        strokeDasharray="4 4"
      />
      <rect
        x="79"
        y="72"
        width="42"
        height="40"
        rx="4"
        fill="#d8e2c7"
        stroke="#809365"
      />
      <path d="M85 111h30" stroke="#405b32" strokeWidth="4" />
      <text x="100" y="128" textAnchor="middle" fontSize="8" fill="#405b32">
        DEPAN
      </text>
      <text x="136" y="95" fontSize="8" fill="#687d51">
        KANAN
      </text>
      {angle < 8 ? (
        <>
          <path
            d={`M${x} ${y} L100 92`}
            stroke="#405b32"
            strokeDasharray="3 3"
          />
          <circle cx={x} cy={y} r="10" fill="#405b32" />
          <circle cx={x} cy={y} r="4" fill="#e8efd9" />
        </>
      ) : (
        <>
          <circle cx="100" cy="92" r="10" fill="#405b32" />
          <text x="100" y="24" textAnchor="middle" fontSize="10" fill="#405b32">
            {angle === 8
              ? "KAMERA DI ATAS"
              : angle === 9
                ? "BALIK OBJEK JIKA AMAN"
                : "FOTO DARI DEKAT"}
          </text>
        </>
      )}
    </svg>
  );
}
async function db() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const r = indexedDB.open("sudut-studio", 1);
    r.onupgradeneeded = () =>
      r.result.createObjectStore("drafts", { keyPath: "id" });
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
function hasExport(d: Draft) {
  return !!d.exportedAt && d.exportedAt >= d.updated;
}
export default function Home() {
  const [screen, setScreen] = useState("home");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [angle, setAngle] = useState(0);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [help, setHelp] = useState(false);
  const [filter, setFilter] = useState("Semua objek");
  const [skipped, setSkipped] = useState<Record<number, string>>({});
  const [skip, setSkip] = useState(false);
  const [reason, setReason] = useState("");
  const [detailLabel, setDetailLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [stored, setStored] = useState(true);
  const [deletePhoto, setDeletePhoto] = useState<number | null>(null);
  const [deleteDraft, setDeleteDraft] = useState(false);
  const [returnToReview, setReturnToReview] = useState(false);
  const saveQueue = useRef<Promise<unknown>>(Promise.resolve());
  const saveVersion = useRef(0);
  const file = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  useEffect(() => {
    db()
      .then((d) => {
        const r = d.transaction("drafts").objectStore("drafts").getAll();
        r.onsuccess = () => {
          setDrafts(
            r.result.sort((a: Draft, b: Draft) => b.updated - a.updated),
          );
          d.close();
        };
        r.onerror = () => {
          d.close();
          setStored(false);
          setError("Draft lokal belum dapat dibaca. Coba muat ulang browser.");
        };
      })
      .catch(() => {
        setStored(false);
        setError(
          "Penyimpanan lokal tidak tersedia. Draft belum dapat disimpan.",
        );
      });
  }, []);
  useEffect(() => {
    if (!help && !skip && deletePhoto === null && !deleteDraft) return;
    const previous = document.activeElement as HTMLElement | null;
    const modal = document.querySelector<HTMLElement>(".modal");
    const controls = () =>
      Array.from(
        modal?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input, textarea, [tabindex="0"]',
        ) || [],
      );
    (
      modal?.querySelector<HTMLElement>("textarea, .secondary") || controls()[0]
    )?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHelp(false);
        setSkip(false);
        setDeletePhoto(null);
        setDeleteDraft(false);
      }
      if (event.key === "Tab") {
        const elements = controls();
        const first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("keydown", keyboard);
      previous?.focus();
    };
  }, [help, skip, deletePhoto, deleteDraft]);
  async function save(d: Draft) {
    const version = ++saveVersion.current;
    setDraft(d);
    setDrafts((ds) => [d, ...ds.filter((x) => x.id !== d.id)]);
    setStored(false);
    const operation = saveQueue.current.then(async () => {
      const conn = await db();
      try {
        await new Promise<void>((resolve, reject) => {
          const tx = conn.transaction("drafts", "readwrite");
          tx.objectStore("drafts").put(d);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
          tx.onabort = () => reject(tx.error);
        });
      } finally {
        conn.close();
      }
    });
    saveQueue.current = operation.catch(() => {});
    try {
      await operation;
      if (version === saveVersion.current) setStored(true);
      return true;
    } catch {
      setStored(false);
      setError(
        "Draft gagal disimpan di perangkat. Unduh paket foto sebagai cadangan sebelum menutup halaman.",
      );
      return false;
    }
  }
  async function removeDraft() {
    if (!draft) return;
    try {
      await saveQueue.current;
      const conn = await db();
      await new Promise<void>((resolve, reject) => {
        const tx = conn.transaction("drafts", "readwrite");
        tx.objectStore("drafts").delete(draft.id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      conn.close();
      setDrafts((ds) => ds.filter((d) => d.id !== draft.id));
      setDraft(null);
      setDeleteDraft(false);
      go("home");
    } catch {
      setError("Draft belum berhasil dihapus. Silakan coba lagi.");
    }
  }
  function openCapture(i: number) {
    setAngle(i);
    setDetailLabel(draft?.photos.find((p) => p.angle === i)?.label || "");
    setReturnToReview(true);
    go("capture");
  }
  async function download() {
    if (!draft || busy || !draft.photos.length) return;
    setBusy(true);
    setError("");
    try {
      await exportDraft(draft);
      await save({ ...draft, exportedAt: Date.now() });
      go("exported");
    } catch {
      setError(
        "Paket belum berhasil dibuat. Coba lagi sebelum menutup halaman.",
      );
    } finally {
      setBusy(false);
    }
  }
  function go(s: string) {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function create(e: React.FormEvent) {
    e.preventDefault();
    const d = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description,
      photos: [],
      updated: Date.now(),
    };
    await save(d);
    setReturnToReview(false);
    setAngle(0);
    setSkipped({});
    go("prepare");
  }
  async function upload(f?: File) {
    if (!f || busy) return;
    if (!draft) return;
    if (
      draft.photos.length >= 20 &&
      !draft.photos.some((p) => p.angle === angle)
    ) {
      setError(
        "Maksimal 20 foto per objek. Hapus salah satu foto untuk melanjutkan.",
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      setPreview(await processImage(f));
      go("preview");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Foto gagal diproses. Silakan pilih ulang.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function usePhoto() {
    if (!draft || busy) return;
    setBusy(true);
    try {
      const skippedNext = { ...draft.skipped };
      delete skippedNext[angle];
      setSkipped(skippedNext);
      await save({
        ...draft,
        skipped: skippedNext,
        photos: [
          ...draft.photos.filter((p) => p.angle !== angle),
          {
            angle,
            src: preview,
            ...(angle >= 10 ? { label: detailLabel.trim() } : {}),
          },
        ],
        updated: Date.now(),
      });
      if (angle >= 8 || returnToReview) go("review");
      else {
        setAngle(angle + 1);
        go("capture");
      }
    } finally {
      setBusy(false);
    }
  }
  const visibleDrafts = drafts.filter(
    (d) =>
      filter === "Semua objek" ||
      (filter === "Paket dibuat" ? hasExport(d) : !hasExport(d)),
  );
  const count = draft?.photos.length || 0;
  const mainCount = draft?.photos.filter((p) => p.angle < 9).length || 0;
  const currentLabel = labelFor(angle);
  return (
    <>
      <header className="header">
        <button
          className="brand"
          onClick={() => go("home")}
          aria-label="Beranda Sudut"
        >
          <span className="brand-icon">
            <Scan size={23} />
          </span>
          sudut<span className="brand-dot">.</span>
        </button>
        <nav>
          <button
            className={screen === "home" ? "nav-active" : ""}
            onClick={() => go("home")}
          >
            Ruang kerja
          </button>
          <button onClick={() => setHelp(true)}>
            Panduan foto <ArrowUpRight size={13} />
          </button>
        </nav>
        <div className="header-right">
          <span className="local-label">
            <span /> Ruang pribadi Anda
          </span>
          <button
            className="help-icon"
            onClick={() => setHelp(true)}
            aria-label="Bantuan"
          >
            <CircleHelp size={20} />
          </button>
          <span className="avatar">A</span>
        </div>
      </header>
      <main>
        {!stored && (
          <div className="notice storage-notice" role="status">
            <AlertCircle size={18} />
            <span>
              Draft belum tersimpan. Tetap di halaman ini; jika penyimpanan
              gagal, unduh paket sebagai cadangan.
            </span>
          </div>
        )}
        {screen === "home" ? (
          <>
            <div className="page-heading">
              <div>
                <div className="eyebrow">RUANG KERJA ANDA</div>
                <h1>Objek nyata. Kemungkinan baru.</h1>
                <p>
                  Mulai dari foto yang baik, wujudkan model 3D yang lebih
                  detail.
                </p>
              </div>
              <span className="date">
                STUDIO REFERENSI 3D <span> / </span> 01
              </span>
            </div>
            <section className="hero">
              <div className="hero-copy">
                <div className="pill">
                  <span /> DARI BERBAGAI SISI, JADI SATU REFERENSI
                </div>
                <h2>
                  Setiap sudut
                  <br />
                  punya <em>cerita.</em>
                </h2>
                <p>
                  Abadikan objek dari setiap sisi. Kami pandu
                  <br className="desktop-break" /> langkahnya, Anda tangkap
                  detailnya.
                </p>
                <button
                  className="primary"
                  onClick={() => {
                    setName("");
                    setDescription("");
                    go("new");
                  }}
                >
                  <Plus size={19} /> Buat objek baru <ArrowUpRight size={18} />
                </button>
                <div className="hero-foot">
                  <ShieldCheck size={15} /> Tanpa login <span>·</span> Draft
                  tersimpan di perangkat
                </div>
              </div>
              <div className="hero-art">
                <div className="art-label">
                  <span className="label-line" /> TANGKAP BENTUK. SIMPAN DETAIL.
                </div>
                <Illustration />
                <span className="angle-badge">
                  <Camera size={14} /> 9 sudut. Satu objek utuh.
                </span>
                <span className="art-number">360°</span>
              </div>
            </section>
            <section className="workflow">
              <div className="section-overline">SESEDERHANA 1, 2, 3</div>
              <div className="steps">
                <div>
                  <span className="step-icon">
                    <Box size={20} />
                  </span>
                  <div>
                    <h3>
                      <b>01</b> Kenalkan objeknya
                    </h3>
                    <p>Beri nama objek yang ingin Anda abadikan.</p>
                  </div>
                </div>
                <ChevronRight className="step-arrow" size={17} />
                <div>
                  <span className="step-icon">
                    <Camera size={20} />
                  </span>
                  <div>
                    <h3>
                      <b>02</b> Ikuti setiap sudut
                    </h3>
                    <p>Panduan visual untuk foto yang konsisten.</p>
                  </div>
                </div>
                <ChevronRight className="step-arrow" size={17} />
                <div>
                  <span className="step-icon">
                    <Layers3 size={20} />
                  </span>
                  <div>
                    <h3>
                      <b>03</b> Review & unduh
                    </h3>
                    <p>Satu paket foto, siap jadi referensi 3D.</p>
                  </div>
                </div>
              </div>
            </section>
            <section className="objects">
              <div className="section-title">
                <div>
                  <h2>
                    Objek Anda{" "}
                    <span>{drafts.length.toString().padStart(2, "0")}</span>
                  </h2>
                  <p>Ide berikutnya dimulai dari satu objek.</p>
                </div>
                <button className="text-button" onClick={() => setHelp(true)}>
                  <CircleHelp size={15} /> Tentang draft lokal
                </button>
              </div>
              <div className="tabs">
                {["Semua objek", "Belum diekspor", "Paket dibuat"].map((t) => (
                  <button
                    key={t}
                    className={filter === t ? "selected" : ""}
                    onClick={() => setFilter(t)}
                  >
                    {t}
                    {t === "Belum diekspor" && (
                      <span>{drafts.filter((d) => !hasExport(d)).length}</span>
                    )}
                  </button>
                ))}
              </div>
              {visibleDrafts.length > 0 ? (
                <div className="draft-grid">
                  {visibleDrafts.map((d) => (
                    <button
                      className="draft-card"
                      key={d.id}
                      onClick={() => {
                        setDraft(d);
                        setSkipped(d.skipped || {});
                        setAngle(
                          angles.findIndex(
                            (_, i) => !d.photos.some((p) => p.angle === i),
                          ) < 0
                            ? 8
                            : angles.findIndex(
                                (_, i) => !d.photos.some((p) => p.angle === i),
                              ),
                        );
                        go("review");
                      }}
                    >
                      <div className="draft-thumb">
                        {mainPhoto(d) ? (
                          <img src={mainPhoto(d)!.src} alt={d.name} />
                        ) : (
                          <Box size={40} />
                        )}
                        <span className="draft-tag">
                          {hasExport(d) ? "Paket dibuat" : "Draft lokal"}
                        </span>
                      </div>
                      <h3>
                        {d.name}
                        <ArrowUpRight size={17} />
                      </h3>
                      <p>
                        {d.photos.filter((p) => p.angle < 9).length} dari 9
                        sudut{" "}
                        <span>
                          Lanjutkan <ArrowRight size={14} />
                        </span>
                      </p>
                      <div className="progress">
                        <i
                          style={{
                            width: `${(d.photos.filter((p) => p.angle < 9).length / 9) * 100}%`,
                          }}
                        />
                      </div>
                    </button>
                  ))}
                  <button
                    className="add-card"
                    onClick={() => {
                      setName("");
                      setDescription("");
                      go("new");
                    }}
                  >
                    <Plus size={26} /> Buat objek baru
                  </button>
                </div>
              ) : (
                <div className="empty">
                  <div className="empty-art">
                    <Box size={28} />
                    <span>+</span>
                  </div>
                  <h3>
                    {filter === "Paket dibuat"
                      ? "Belum ada paket ZIP dibuat"
                      : "Masih kosong. Siap untuk objek pertama?"}
                  </h3>
                  <p>
                    {filter === "Paket dibuat"
                      ? "Selesaikan review, lalu unduh paket ZIP untuk dikirim sendiri."
                      : "Benda sehari-hari bisa jadi awal sesuatu yang luar biasa."}
                  </p>
                  {filter !== "Paket dibuat" && (
                    <button
                      onClick={() => {
                        setName("");
                        setDescription("");
                        go("new");
                      }}
                    >
                      Buat objek pertama <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              )}
            </section>
            <div className="tip">
              <Sun size={19} />
              <p>
                <strong>Foto yang baik, model yang lebih baik.</strong> Gunakan
                cahaya merata dan latar sederhana untuk menangkap semua detail.
              </p>
              <button onClick={() => setHelp(true)}>
                Lihat tips foto <ArrowUpRight size={15} />
              </button>
            </div>
          </>
        ) : (
          <div className="flow-wrap">
            <button
              className="back"
              onClick={() =>
                go(
                  screen === "preview"
                    ? "capture"
                    : screen === "capture"
                      ? "review"
                      : "home",
                )
              }
            >
              <ArrowLeft size={16} />{" "}
              {screen === "capture" ? "Ke review" : "Kembali"}
            </button>
            <div className="flow-steps">
              {["Objek", "Persiapan", "Foto", "Review"].map((s, i) => (
                <span
                  key={s}
                  className={
                    ["new", "prepare", "capture", "review"].indexOf(
                      screen === "preview"
                        ? "capture"
                        : screen === "exported"
                          ? "review"
                          : screen,
                    ) >= i
                      ? "active"
                      : ""
                  }
                >
                  <b>{i + 1}</b>
                  {s}
                </span>
              ))}
            </div>
            {screen === "new" && (
              <section className="form-panel">
                <div className="eyebrow">MULAI DENGAN SATU BENDA</div>
                <h1>Kenalkan objek Anda.</h1>
                <p>
                  Beri nama yang mudah dikenali. Detail lainnya bisa menyusul.
                </p>
                <form onSubmit={create}>
                  <label htmlFor="name">
                    Nama objek <span>*</span>
                  </label>
                  <input
                    id="name"
                    placeholder="Misalnya, kamera analog kesayangan"
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                  <label htmlFor="desc">
                    Deskripsi singkat <small>Opsional</small>
                  </label>
                  <textarea
                    id="desc"
                    placeholder="Ceritakan sedikit tentang objek ini…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="form-note">
                    <ShieldCheck size={18} /> Draft dan foto disimpan di browser
                    pada perangkat ini.
                  </div>
                  <button className="primary wide" disabled={!name.trim()}>
                    Lanjut ke persiapan <ArrowRight size={17} />
                  </button>
                </form>
              </section>
            )}
            {screen === "prepare" && (
              <section className="form-panel">
                <div className="eyebrow">SEBELUM MULAI</div>
                <h1>
                  Sedikit persiapan,
                  <br />
                  hasil lebih maksimal.
                </h1>
                <p>Siapkan {draft?.name} dan tempat yang nyaman.</p>
                <div className="prep-list">
                  {[
                    [
                      Sun,
                      "Cari cahaya yang merata",
                      "Pilih tempat terang dan latar sederhana. Hindari bayangan keras.",
                    ],
                    [
                      Scan,
                      "Beri objek sedikit ruang",
                      "Pastikan seluruh objek masuk frame. Jaga jarak dan tinggi kamera.",
                    ],
                    [
                      Camera,
                      "Gunakan kamera utama",
                      "Tanpa filter atau zoom digital. Periksa foto agar tidak buram.",
                    ],
                    [
                      Box,
                      "Jaga posisi dan kondisinya",
                      "Pertahankan aksesori dan komponen saat mengelilingi objek.",
                    ],
                  ].map(([Icon, title, body], i) => {
                    const I = Icon as typeof Sun;
                    return (
                      <div key={i}>
                        <span className="step-icon">
                          <I size={21} />
                        </span>
                        <div>
                          <h3>{title as string}</h3>
                          <p>{body as string}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="primary wide" onClick={() => go("capture")}>
                  Siap, ambil foto pertama <Camera size={18} />
                </button>
                <p className="center-note">
                  Sekitar 5–10 menit · 9 sudut foto utama
                </p>
              </section>
            )}
            {screen === "capture" && (
              <section className="capture-panel">
                <div className="capture-top">
                  <span className="eyebrow">{draft?.name}</span>
                  <span>
                    {angle < 9
                      ? `Sudut ${angle + 1} dari 9`
                      : "Foto tambahan · opsional"}
                  </span>
                </div>
                <div className="progress">
                  <i
                    style={{ width: `${(Math.min(angle + 1, 9) / 9) * 100}%` }}
                  />
                </div>
                <h1>{currentLabel}</h1>
                <p>{instructions[Math.min(angle, 10)]}</p>
                <div className="capture-art">
                  <Illustration angle={angle} />
                  <div
                    className="view-diagram"
                    aria-label={`Posisi kamera untuk ${currentLabel}`}
                  >
                    <AngleGuide angle={angle} />
                  </div>
                  <span className="orientation">
                    Acuan tetap: sisi depan ditetapkan pada foto pertama
                  </span>
                </div>
                <div className="angle-dots">
                  {angles.map((s, i) => (
                    <button
                      title={s}
                      aria-label={s}
                      key={s}
                      className={
                        i === angle
                          ? "current"
                          : draft?.photos.some((p) => p.angle === i)
                            ? "done"
                            : ""
                      }
                      onClick={() => {
                        setAngle(i);
                        setDetailLabel("");
                      }}
                    >
                      {draft?.photos.some((p) => p.angle === i) ? (
                        <Check size={12} />
                      ) : (
                        i + 1
                      )}
                    </button>
                  ))}
                </div>
                <button
                  className="primary wide"
                  disabled={busy}
                  onClick={() => camera.current?.click()}
                >
                  <Camera size={18} /> Ambil foto
                </button>
                <button
                  className="secondary wide"
                  disabled={busy}
                  onClick={() => file.current?.click()}
                >
                  <ImagePlus size={18} /> Pilih dari galeri
                </button>
                {angle < 9 ? (
                  <button className="skip" onClick={() => setSkip(true)}>
                    Sudut sulit dijangkau? Lewati sudut ini
                  </button>
                ) : (
                  <button className="skip" onClick={() => go("review")}>
                    Batal, kembali ke review
                  </button>
                )}
                <p className="center-note">
                  {busy
                    ? "Memproses gambar…"
                    : "Kamera tidak terbuka? Gunakan pilihan dari galeri."}
                </p>
              </section>
            )}
            {screen === "preview" && (
              <section className="capture-panel">
                <div className="eyebrow">PERIKSA HASIL FOTO</div>
                <h1>Sudah terlihat jelas?</h1>
                <p>
                  {currentLabel} · Pastikan tidak buram dan seluruh objek
                  terlihat.
                </p>
                <img
                  className="photo-preview"
                  src={preview}
                  alt={`Preview foto ${currentLabel}`}
                />
                <>
                  {angle >= 10 && (
                    <label>
                      Bagian apa ini? <span>*</span>
                      <input
                        maxLength={100}
                        placeholder="Misalnya, konektor di sisi belakang"
                        value={detailLabel}
                        onChange={(e) => setDetailLabel(e.target.value)}
                      />
                    </label>
                  )}
                </>
                <button
                  className="primary wide"
                  disabled={busy || (angle >= 10 && !detailLabel.trim())}
                  onClick={usePhoto}
                >
                  <Check size={18} /> Gunakan foto
                </button>
                <button
                  className="secondary wide"
                  onClick={() => go("capture")}
                >
                  <RotateCcw size={17} /> Foto ulang
                </button>
              </section>
            )}
            {screen === "review" && (
              <section className="review-panel">
                <div className="eyebrow">SELANGKAH LEBIH DEKAT</div>
                <h1>Setiap sisi, sudah terwakili?</h1>
                <p>
                  {draft?.name}{" "}
                  <span className="review-count">
                    {mainCount}/9 foto utama · {count} foto total
                  </span>
                </p>
                <div className="review-grid">
                  {angles.map((a, i) => {
                    const p = draft?.photos.find((p) => p.angle === i);
                    return (
                      <button
                        key={a}
                        aria-label={`Foto ${a}: ${p ? "tersedia" : "belum tersedia"}`}
                        onClick={() => openCapture(i)}
                      >
                        <div>
                          {p ? <img src={p.src} alt={a} /> : <Plus size={24} />}
                          <span
                            className={
                              p ? "photo-state complete" : "photo-state"
                            }
                          >
                            {p ? <Check size={12} /> : i + 1}
                          </span>
                        </div>
                        <span>{a}</span>
                        <small>
                          {p
                            ? "Ganti foto"
                            : skipped[i]
                              ? `Dilewati: ${skipped[i]}`
                              : "Tambahkan foto"}
                        </small>
                      </button>
                    );
                  })}
                </div>
                {mainCount < 9 && (
                  <div className="notice">
                    <AlertCircle size={18} />
                    <span>
                      {9 - mainCount} sudut belum tersedia. Lengkapi untuk
                      referensi yang lebih baik.
                    </span>
                  </div>
                )}
                <section className="extra-photos">
                  <h2>
                    Foto tambahan <small>Opsional</small>
                  </h2>
                  <p>
                    Lengkapi bagian bawah dan detail yang perlu dipertahankan.
                  </p>
                  <div className="extra-actions">
                    <button
                      className="secondary"
                      disabled={
                        count >= 20 && !draft?.photos.some((p) => p.angle === 9)
                      }
                      onClick={() => openCapture(9)}
                    >
                      <Camera size={16} />
                      {draft?.photos.some((p) => p.angle === 9)
                        ? "Ganti foto bawah"
                        : "Foto bawah"}
                    </button>
                    <button
                      className="secondary"
                      disabled={count >= 20}
                      onClick={() =>
                        openCapture(
                          Math.max(
                            9,
                            ...(draft?.photos.map((p) => p.angle) || []),
                          ) + 1,
                        )
                      }
                    >
                      <Plus size={16} />
                      Foto detail
                    </button>
                  </div>
                  <p className="center-note">
                    {count}/20 foto · Maksimal 15 MB per foto
                  </p>
                </section>
                {count > 0 && (
                  <section className="photo-manager">
                    <h2>Kelola foto & pilih foto utama</h2>
                    <p>Serong depan kanan dipilih otomatis jika tersedia.</p>
                    {draft?.photos.map((p) => (
                      <div className="photo-row" key={p.angle}>
                        <img src={p.src} alt={p.label || labelFor(p.angle)} />
                        <div>
                          <strong>{labelFor(p.angle)}</strong>
                          {p.label && <span>{p.label}</span>}
                          {mainPhoto(draft)?.angle === p.angle && (
                            <small>Foto utama</small>
                          )}
                        </div>
                        <button
                          aria-label={`Jadikan ${p.label || labelFor(p.angle)} foto utama`}
                          className="text-button"
                          disabled={mainPhoto(draft)?.angle === p.angle}
                          onClick={() =>
                            void save({
                              ...draft,
                              mainAngle: p.angle,
                              updated: Date.now(),
                            })
                          }
                        >
                          <CheckCircle2 size={17} />
                        </button>
                        <button
                          className="text-button"
                          aria-label={`Ganti foto ${p.label || labelFor(p.angle)}`}
                          onClick={() => openCapture(p.angle)}
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button
                          className="text-button"
                          aria-label={`Hapus foto ${p.label || labelFor(p.angle)}`}
                          onClick={() => setDeletePhoto(p.angle)}
                        >
                          <X size={17} />
                        </button>
                      </div>
                    ))}
                  </section>
                )}
                <details className="metadata">
                  <summary>
                    Ukuran & catatan tambahan <span>Opsional</span>
                  </summary>
                  <div className="dimension-fields">
                    {["Lebar (cm)", "Kedalaman (cm)", "Tinggi (cm)"].map(
                      (x) => (
                        <label key={x}>
                          {x}
                          <input
                            type="number"
                            min="0"
                            placeholder="Tidak diketahui"
                            value={draft?.dimensions?.[x] || ""}
                            onChange={(e) => {
                              if (draft)
                                void save({
                                  ...draft,
                                  dimensions: {
                                    ...draft.dimensions,
                                    [x]: e.target.value,
                                  },
                                  updated: Date.now(),
                                });
                            }}
                          />
                        </label>
                      ),
                    )}
                  </div>
                  {(
                    [
                      ["material", "Material utama"],
                      ["movingParts", "Bagian yang dapat bergerak"],
                      ["preservedDetails", "Detail yang harus dipertahankan"],
                    ] as const
                  ).map(([key, title]) => (
                    <label key={key}>
                      {title}
                      <input
                        maxLength={500}
                        value={draft?.[key] || ""}
                        onChange={(e) => {
                          if (draft)
                            void save({
                              ...draft,
                              [key]: e.target.value,
                              updated: Date.now(),
                            });
                        }}
                      />
                    </label>
                  ))}
                  <label>
                    Catatan objek
                    <textarea
                      placeholder="Material, bagian bergerak, atau detail penting…"
                      value={draft?.notes || ""}
                      onChange={(e) => {
                        if (draft)
                          void save({
                            ...draft,
                            notes: e.target.value,
                            updated: Date.now(),
                          });
                      }}
                    />
                  </label>
                </details>
                <div className="form-note">
                  <ShieldCheck size={20} /> Foto diproses di perangkat Anda.
                  Unduh paket ZIP, lalu kirim atau unggah sendiri melalui
                  layanan pilihan Anda.
                </div>
                <button
                  className="primary wide"
                  disabled={!count || busy}
                  onClick={download}
                >
                  <Layers3 size={18} />
                  {busy ? "Menyiapkan paket…" : "Unduh paket referensi (.zip)"}
                </button>
                <p className="center-note">
                  {stored
                    ? "Draft tersimpan di perangkat ini."
                    : "Draft belum tersimpan. Unduh paket sebagai cadangan."}{" "}
                  Aplikasi tidak mengirim foto secara otomatis.
                </p>
                <button
                  className="skip danger"
                  onClick={() => setDeleteDraft(true)}
                >
                  Hapus draft ini
                </button>
              </section>
            )}
            {screen === "exported" && (
              <section className="form-panel center">
                <span className="large-icon">
                  <CheckCircle2 size={34} />
                </span>
                <div className="eyebrow">PAKET REFERENSI SIAP</div>
                <h1>Lanjutkan dengan ZIP Anda.</h1>
                <p>
                  {count} foto {draft?.name}, README, dan metadata sudah
                  dikemas.
                </p>
                <div className="notice">
                  <Layers3 size={20} />
                  <span>
                    Permintaan unduhan sudah dimulai. Periksa folder Unduhan
                    browser Anda, lalu kirim ZIP melalui WhatsApp, email, atau
                    unggah ke layanan pilihan Anda. Aplikasi tidak mengetahui
                    apakah file sudah tersimpan atau terkirim.
                  </span>
                </div>
                <button
                  className="primary wide"
                  disabled={busy}
                  onClick={download}
                >
                  {busy ? "Menyiapkan paket…" : "Unduh ZIP lagi"}{" "}
                  <ArrowRight size={17} />
                </button>
                <button
                  className="secondary wide"
                  onClick={() => {
                    setName("");
                    setDescription("");
                    go("new");
                  }}
                >
                  Buat objek lain <Plus size={17} />
                </button>
                <button className="skip" onClick={() => go("review")}>
                  Kembali ke review
                </button>
              </section>
            )}
          </div>
        )}
      </main>
      <footer>
        <span className="footer-brand">
          <Scan size={15} /> sudut.
        </span>
        <span>Dari objek nyata, menuju dimensi baru.</span>
        <span className="footer-right">
          Dibuat untuk setiap perspektif <span>✳</span>
        </span>
      </footer>
      <input
        ref={file}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={camera}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {error && (
        <div className="toast" role="alert">
          <AlertCircle size={20} />
          {error}
          <button onClick={() => setError("")} aria-label="Tutup">
            <X size={16} />
          </button>
        </div>
      )}
      {help && (
        <div className="modal-backdrop" onClick={() => setHelp(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setHelp(false)}
              aria-label="Tutup panduan"
            >
              <X size={20} />
            </button>
            <div className="eyebrow">PANDUAN SUDUT</div>
            <h2 id="help-title">Foto yang baik dimulai di sini.</h2>
            <Illustration small />
            <p>
              Ambil 8 foto mengelilingi objek dan satu dari atas. Sisi depan
              pada foto pertama menjadi acuan kanan dan kiri untuk seluruh sesi.
            </p>
            <p>
              Gunakan cahaya merata, latar sederhana, dan kamera tanpa filter.
              Periksa ketajaman setiap foto melalui preview.
            </p>
            <div className="notice">
              <ShieldCheck size={20} />
              <span>
                Draft disimpan di browser dan perangkat yang sama. Membersihkan
                data browser akan menghapus draft. Draft belum menjadi cadangan
                permanen.
              </span>
            </div>
            <button className="primary wide" onClick={() => setHelp(false)}>
              Mengerti <Check size={16} />
            </button>
          </section>
        </div>
      )}
      {(deletePhoto !== null || deleteDraft) && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <h2 id="delete-title">
              {deleteDraft ? "Hapus draft beserta fotonya?" : "Hapus foto ini?"}
            </h2>
            <p>
              Tindakan ini menghapus data lokal dan tidak dapat dibatalkan.
              Unduh paket referensi terlebih dahulu jika diperlukan.
            </p>
            <button
              className="primary wide"
              onClick={async () => {
                if (deleteDraft) {
                  await removeDraft();
                  return;
                }
                if (draft) {
                  await save({
                    ...draft,
                    photos: draft.photos.filter((p) => p.angle !== deletePhoto),
                    mainAngle:
                      draft.mainAngle === deletePhoto
                        ? undefined
                        : draft.mainAngle,
                    updated: Date.now(),
                  });
                  setDeletePhoto(null);
                }
              }}
            >
              Ya, hapus
            </button>
            <button
              className="secondary wide"
              onClick={() => {
                setDeletePhoto(null);
                setDeleteDraft(false);
              }}
            >
              Batal
            </button>
          </section>
        </div>
      )}
      {skip && (
        <div className="modal-backdrop">
          <form
            className="modal"
            onSubmit={(e) => {
              e.preventDefault();
              const nextSkipped = { ...skipped, [angle]: reason };
              setSkipped(nextSkipped);
              if (draft)
                void save({
                  ...draft,
                  skipped: nextSkipped,
                  updated: Date.now(),
                });
              setSkip(false);
              setReason("");
              if (angle >= 8 || returnToReview) go("review");
              else setAngle(angle + 1);
            }}
          >
            <h2>Lewati {angles[angle].toLowerCase()}?</h2>
            <p>Tidak perlu mengambil risiko untuk mendapatkan foto.</p>
            <label htmlFor="reason">Alasan melewati sudut</label>
            <textarea
              id="reason"
              required
              placeholder="Misalnya, sisi ini tidak dapat dijangkau dengan aman"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button className="primary wide" disabled={!reason.trim()}>
              Simpan alasan & lanjut <ArrowRight size={17} />
            </button>
            <button
              type="button"
              className="skip"
              onClick={() => setSkip(false)}
            >
              Batal
            </button>
          </form>
        </div>
      )}
    </>
  );
}
