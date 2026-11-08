// Dev-only: tidak ikut bundel produksi.
// Konversi satu jalan:
//   1. Halaman pertama 5 PDF sertifikat -> JPG 1200x800 (3:2) di bawah 200 KB.
//      Halaman utuh digambar "contain" di atas kertas hangat agar teks tidak
//      terpotong (sertifikat umumnya A4 potret).
//   2. PNG project -> JPG 1600x1000 (16:10) di bawah 300 KB (cover-crop).
// Jalankan: npm run assets
// Dependensi (dev): pdfjs-dist (render PDF) + @napi-rs/canvas (canvas biner
// tanpa node-gyp, aman di Windows).
import fs from 'node:fs/promises';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const ROOT = path.resolve(process.cwd(), 'public');
const PAPER = '#f3f0e9'; // warna kertas hangat (tema terang) untuk letterbox

const JOBS = [
  { kind: 'pdf', src: 'images/certificates/dicoding-javascript.pdf', out: 'images/certificates/dicoding-javascript.jpg' },
  { kind: 'pdf', src: 'images/certificates/dicoding-aws-cloud-genai.pdf', out: 'images/certificates/dicoding-aws-cloud-genai.jpg' },
  { kind: 'pdf', src: 'images/certificates/dts-junior-mobile-programmer.pdf', out: 'images/certificates/dts-junior-mobile-programmer.jpg' },
  { kind: 'pdf', src: 'images/certificates/dts-junior-web-developer.pdf', out: 'images/certificates/dts-junior-web-developer.jpg' },
  { kind: 'pdf', src: 'images/certificates/mikrotik-mtcna.pdf', out: 'images/certificates/mikrotik-mtcna.jpg' },
  { kind: 'png', src: 'images/projects/Siakad.png', out: 'images/projects/sistem-nilai-rapor.jpg' },
  { kind: 'png', src: 'images/projects/POS.png', out: 'images/projects/pos-payment-gateway.jpg' },
];

async function saveJpeg(canvas, outPath, limitKb, label) {
  for (const q of [0.9, 0.8, 0.7, 0.6, 0.5]) {
    const buf = await canvas.encode('jpeg', q);
    const kb = buf.length / 1024;
    if (kb <= limitKb || q === 0.5) {
      await fs.writeFile(outPath, buf);
      console.log(`${label}  ${(canvas.width)}x${canvas.height}  ${kb.toFixed(0)} KB (q=${q})`);
      return;
    }
  }
}

async function convertPdf(src, out) {
  const data = new Uint8Array(await fs.readFile(src));
  const pdf = await getDocument({ data, useSystemFonts: true, isEvalSupported: false }).promise;
  const page = await pdf.getPage(1);

  const base = page.getViewport({ scale: 1 });
  const scale = 2400 / base.width;
  const vp = page.getViewport({ scale });
  const srcCanvas = createCanvas(Math.ceil(vp.width), Math.ceil(vp.height));
  const srcCtx = srcCanvas.getContext('2d');
  await page.render({ canvasContext: srcCtx, viewport: vp, background: PAPER, pageColors: null }).promise;
  page.cleanup();

  const canvas = createCanvas(1200, 800);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, 1200, 800);
  const fit = Math.min(1200 / srcCanvas.width, 800 / srcCanvas.height);
  const dw = srcCanvas.width * fit;
  const dh = srcCanvas.height * fit;
  ctx.drawImage(srcCanvas, (1200 - dw) / 2, (800 - dh) / 2, dw, dh);

  await saveJpeg(canvas, out, 200, path.basename(out));
}

async function convertPng(src, out) {
  const img = await loadImage(src);
  const canvas = createCanvas(1600, 1000);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, 1600, 1000);
  const fit = Math.max(1600 / img.width, 1000 / img.height);
  const dw = img.width * fit;
  const dh = img.height * fit;
  ctx.drawImage(img, (1600 - dw) / 2, (1000 - dh) / 2, dw, dh);
  await saveJpeg(canvas, out, 300, path.basename(out));
}

let failed = 0;
for (const job of JOBS) {
  const src = path.join(ROOT, job.src);
  const out = path.join(ROOT, job.out);
  try {
    if (job.kind === 'pdf') await convertPdf(src, out);
    else await convertPng(src, out);
  } catch (err) {
    failed++;
    console.error(`GAGAL ${job.src}: ${err instanceof Error ? err.message : String(err)}`);
  }
}
if (failed) {
  console.error(`${failed} konversi gagal. Perbaiki lalu jalankan ulang: npm run assets`);
  process.exit(1);
}
console.log('Semua pratinjau selesai.');
