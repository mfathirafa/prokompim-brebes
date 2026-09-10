# Tech Stack

Teknologi yang digunakan dalam pengembangan Portal Web Prokompim Brebes

---

## Frontend

### Next.js 14+ (App Router)
**Alasan pemilihan:**
- Framework React dengan file-based routing — mempercepat development
- Server-side rendering (SSR) dan static generation — optimal untuk SEO portal berita pemerintah
- API routes built-in — tidak perlu setup backend terpisah untuk endpoint sederhana
- Image optimization otomatis — penting untuk portal berita dengan banyak gambar
- Hot reload dan fast refresh — mempercepat iterasi prototype
- Ekosistem matang dan dokumentasi lengkap

**Fitur yang digunakan:**
- App Router (folder-based routing)
- Server Components
- Client Components
- Image Optimization
- API Routes
- Middleware (untuk auth)

---

### Tailwind CSS
**Alasan pemilihan:**
- Utility-first CSS — development UI cepat
- Responsive design otomatis
- Dark mode support (jika diperlukan)
- Konsistensi design system
- Ukuran bundle kecil (tree-shaking)

---

### shadcn/ui
**Alasan pemilihan:**
- Komponen UI siap pakai dengan Tailwind
- Accessible (WCAG compliant)
- Customizable
- Tidak ada dependency berat

---

## Backend & Database

### Supabase
**Alasan pemilihan:**
- All-in-one platform: Database + Auth + Storage + Realtime
- PostgreSQL database — robust dan familiar
- Row Level Security (RLS) — keamanan data tingkat row
- Supabase Auth — login/register siap pakai dengan berbagai provider
- Storage — untuk menyimpan file dokumen (sambutan, tata upacara, e-koran)
- Dashboard admin untuk manage data
- Realtime subscription (jika diperlukan untuk fitur live)
- Free tier untuk development

**Fitur yang digunakan:**
- PostgreSQL Database
- Supabase Auth (email/password)
- Supabase Storage (dokumen, gambar)
- Row Level Security (RLS)

---

## Deployment & Hosting

### Vercel
**Alasan pemilihan:**
- Platform native untuk Next.js
- Deploy otomatis dari GitHub
- Preview deployment untuk setiap branch/PR
- CDN global — akses cepat dari mana saja
- Zero configuration
- Free tier untuk proyek personal/open-source
- Analytics dan logging

---

## Development Tools

### Version Control
- **Git** — version control
- **GitHub** — remote repository, CI/CD

### Code Quality
- **ESLint** — linting JavaScript/TypeScript
- **Prettier** — code formatting

### Design
- **Figma** atau **draw.io** — wireframing dan desain UI

---

## Struktur Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Next.js   │  │  Tailwind   │  │  shadcn/ui  │      │
│  │  (App Router)│  │    CSS      │  │ Components  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (BaaS)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  PostgreSQL │  │ Supabase    │  │  Supabase   │      │
│  │  Database   │  │    Auth     │  │   Storage   │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│                      Supabase                            │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    DEPLOYMENT                            │
│                      Vercel                              │
│         (Auto-deploy from GitHub main branch)            │
└─────────────────────────────────────────────────────────┘
```

---

## Package Dependencies (Preview)

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/auth-helpers-nextjs": "^0.x",
    "tailwindcss": "^3.x",
    "lucide-react": "^0.x",
    "class-variance-authority": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/node": "^20.x",
    "@types/react": "^18.x",
    "eslint": "^8.x",
    "eslint-config-next": "^14.x",
    "prettier": "^3.x"
  }
}
```

---

## Alur Development

1. **Setup project Next.js** dengan TypeScript dan Tailwind
2. **Konfigurasi Supabase** — buat project, setup tables, auth, storage
3. **Install shadcn/ui** — tambahkan komponen yang dibutuhkan
4. **Development iteratif** sesuai timeline prototype model
5. **Testing lokal** dengan data dummy
6. **Deploy ke Vercel** setelah setiap milestone
7. **Iterasi** berdasarkan feedback
