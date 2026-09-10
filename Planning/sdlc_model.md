# Model SDLC

Pemilihan model pengembangan software untuk Portal Web Prokompim Brebes

---

## Model yang Dipilih: Prototype

---

## Alasan Pemilihan

### Konteks Proyek

| Faktor | Kondisi | Implikasi |
|--------|---------|-----------|
| Tim | Solo developer | Tidak perlu overhead koordinasi tim |
| Klien | Instansi pemerintah (Prokompim Brebes) | Lebih mudah memberi feedback dengan "melihat langsung" |
| Waktu | 2 bulan (fleksibel) | Cukup untuk iterasi prototype |
| Requirements | Sudah ada riset referensi yang kuat | Requirements cukup jelas untuk mulai prototype |
| Teknologi | Next.js + Supabase | Memungkinkan development cepat |

### Keunggulan Prototype Model

1. **Visual feedback** — Klien pemerintah lebih mudah memahami prototype yang bisa dilihat/dicoba dibanding dokumen spesifikasi teknis

2. **Iterasi cepat** — Perubahan requirements bisa langsung diimplementasikan tanpa harus revisi dokumen formal

3. **Risiko rendah** — Error atau kesalahan arsitektur terdeteksi sejak awal sebelum pengembangan full-scale

4. **Cocok untuk solo developer** — Tidak ada overhead meeting sprint, standup, dll seperti Scrum/Agile formal

5. **Requirements sudah ada modal** — Riset referensi 5 web prokompim lain + 22 referensi tambahan sudah memberikan gambaran fitur yang jelas

---

## Perbandingan dengan Model Lain

| Model | Keterangan | Kenapa Tidak Dipilih |
|-------|------------|---------------------|
| Waterfall | Linear, fase berurutan | Terlalu kaku, sulit adaptasi jika requirements berubah |
| Scrum/Agile | Sprint 2 minggu, daily standup | Overhead besar untuk solo developer |
| RAD (Rapid App Development) | Fokus pada komponen reusable | Butuh keterlibatan user intensif, lebih cocok untuk tim besar |
| Spiral | Iterasi dengan risk analysis | Terlalu kompleks untuk proyek skala ini |

---

## Fase-Fase Prototype Model

### Fase 1: Requirement Gathering
**Aktivitas:**
- Finalisasi daftar fitur
- Menentukan tech stack
- Membuat user stories
- Konfirmasi ke pembimbing/Prokompim

**Deliverable:** Dokumen requirement

---

### Fase 2: Desain & Wireframe
**Aktivitas:**
- Membuat wireframe semua halaman
- Desain UI/UX
- Menentukan branding Brebes
- Merancang struktur database (ERD)

**Deliverable:** Wireframe, ERD, design mockup

---

### Fase 3: Bangun Prototype
**Aktivitas:**
- Setup project
- Bangun fitur utama (release berita, download, auth)
- UI dasar tanpa polish penuh

**Deliverable:** Prototype fungsional

---

### Fase 4: Evaluasi & Feedback
**Aktivitas:**
- Demo prototype ke klien/pembimbing
- Kumpulkan feedback
- Catat perubahan yang diminta

**Deliverable:** Feedback document

---

### Fase 5: Revisi Prototype (Iterasi)
**Aktivitas:**
- Implementasi feedback
- Perbaikan UI/UX
- Tambah fitur yang terlewat

**Deliverable:** Prototype revisi

*(Fase 3-5 bisa berulang 1-2 kali sesuai kebutuhan)*

---

### Fase 6: Pengembangan Final
**Aktivitas:**
- Kembangkan semua fitur secara penuh
- Polish UI/UX
- Optimasi performa

**Deliverable:** Aplikasi final

---

### Fase 7: Testing
**Aktivitas:**
- Testing fungsionalitas
- Testing responsivitas
- Bug fixing

**Deliverable:** Aplikasi siap deploy

---

### Fase 8: Deployment
**Aktivitas:**
- Deploy ke production
- Monitoring
- Dokumentasi

**Deliverable:** Aplikasi live

---

## Diagram Alur Prototype

```
┌──────────────────┐
│   Requirement    │
│    Gathering     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Desain &      │
│   Wireframe      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Bangun         │◄──────┐
│   Prototype      │       │
└────────┬─────────┘       │
         │                 │
         ▼                 │
┌──────────────────┐       │
│   Evaluasi &     │       │
│   Feedback       │       │
└────────┬─────────┘       │
         │                 │
         ▼                 │
    ┌────────┐             │
    │ Revisi │──── Ya ─────┘
    │ perlu? │
    └───┬────┘
        │ Tidak
        ▼
┌──────────────────┐
│   Pengembangan   │
│      Final       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│     Testing      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Deployment    │
└──────────────────┘
```

---

## Adaptasi untuk Laporan Magang

Model Prototype dipilih karena:
1. Sesuai dengan konteks magang (solo, waktu terbatas, klien pemerintah)
2. Memungkinkan demonstrasi progress berkala ke pembimbing
3. Hasil kerja terlihat sejak awal (bukan hanya dokumen)
4. Iterasi bisa dilakukan tanpa mengulang dari nol
