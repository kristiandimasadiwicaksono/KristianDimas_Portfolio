// Data asli dari CV Kristian Dimas Adi Wicaksono.
// Struktur disamakan dengan src/data/content.ts yang sudah ada di proyek.
// Field tambahan (points, organizations, whatsapp) opsional: komponen perlu menampilkannya.

export interface Project {
  slug: string;
  title: string;
  role: string;
  year: string;
  summary: string;
  stack: string[];
  image?: string;
  imageFit?: 'cover' | 'contain';
  confidential?: boolean;
  links?: { demo?: string; repo?: string };
}

export interface SkillItem {
  name: string;
  context: string;
}

export interface SkillCategory {
  label: string;
  items: SkillItem[];
}

export interface Certificate {
  slug: string;
  title: string;
  issuer: string;
  year: string;
  category?: string;
  image: string;
  /** PDF asli (relatif ke public/, format "images/certificates/<slug>.pdf"). */
  pdf?: string;
  credentialUrl?: string;
}

export const content = {
  name: "KDAW",
  fullName: "Kristian Dimas Adi Wicaksono",
  role: "Web Developer & UI/UX Designer",
  tagline:
    "Membangun sistem web yang rapi, mudah dipakai, dan dirancang dari kebutuhan pengguna.",
  location: "Purbalingga, Jawa Tengah",
  availability: "Tersedia untuk kerja",
  about:
    "Lulusan D3 Teknik Informatika Politeknik Negeri Cilacap dengan minat besar di bidang pengembangan website dan desain UI/UX. " +
    "Saya memiliki pengalaman magang sebagai tim produksi, yang mencakup perancangan, pengembangan, dan pemeliharaan sistem. " +
    "Tugas akhir saya adalah sistem informasi pengelolaan nilai dan rapor siswa berbasis web. " +
    "Saya terbiasa menggunakan PHP, MySQL, dan Tailwind CSS, merancang antarmuka dengan Figma, serta memanfaatkan AI coding assistant seperti OpenCode untuk mempercepat proses pengembangan, debugging, dan refactoring kode. " +
    "Saya memiliki rasa ingin tahu yang tinggi, senang mempelajari hal baru, dan dapat bekerja baik secara mandiri maupun dalam tim.",
  education: {
    degree: "D3 Teknik Informatika",
    institution: "Politeknik Negeri Cilacap",
    year: "2023 — 2026",
    gpa: "3.54 / 4.00",
    points: [
      "Rekayasa perangkat lunak melalui praktik lab: analisis kebutuhan, perancangan UML dan flowchart, aplikasi CRUD, pengujian fungsional, dan kolaborasi tim dengan Git.",
      "Jaringan komputer: IP addressing dan subnetting, VLAN dasar, pengujian konektivitas dengan ping dan traceroute, serta simulasi topologi di Cisco Packet Tracer.",
      "Basis data relasional MySQL: perancangan skema dan relasi, query JOIN, subquery, view, stored procedure, serta pengolahan data untuk rekap dan pelaporan.",
    ],
  },
  experience: [
    {
      id: "metafora-intern",
      company: "PT Metafora Indonesia Teknologi",
      role: "Magang",
      period: "Agu 2025 — Des 2025",
      location: "Yogyakarta",
      summary:
        "Magang di tim produksi: membangun aplikasi POS yang terintegrasi payment gateway, mengembangkan modul ERP, merancang UI/UX untuk client, dan berkolaborasi dalam tim.",
      points: [
        "Membangun aplikasi Point of Sale (POS) berbasis web yang terintegrasi dengan payment gateway secara mandiri.",
        "Mengembangkan modul sistem ERP dan memelihara fungsionalitas sistem demo perusahaan.",
        "Mengikuti meeting dengan client untuk menganalisis kebutuhan proyek, lalu mempresentasikan hasil pengerjaan sistem.",
        "Merancang antarmuka pengguna (UI/UX) untuk website client.",
        "Membuat poster perusahaan sesuai standar branding.",
        "Berkolaborasi dalam tim agar target pengujian sistem dan penyelesaian proyek tercapai tepat waktu.",
      ],
      stack: [],
      confidential: false,
    },
  ],
  organizations: [
    {
      id: "it-fest",
      title: "Humas, IT Fest",
      period: "Jun 2024",
      points: [
        "Mengurus perizinan tempat, peminjaman fasilitas kampus, dan administrasi surat-menyurat ke pihak internal maupun eksternal.",
        "Menjadi contact person utama untuk komunikasi dengan dosen, alumni, dan tamu undangan.",
      ],
    },
    {
      id: "makrab-ti",
      title: "Humas, Makrab TI",
      period: "Nov 2024",
      points: [
        "Mengurus perizinan tempat, peminjaman fasilitas kampus, dan administrasi surat-menyurat ke pihak internal maupun eksternal.",
        "Menjadi contact person utama untuk komunikasi dengan dosen, alumni, dan tamu undangan.",
      ],
    },
  ],
  skills: {
    frontend: {
      label: 'Frontend',
      items: [
        { name: 'HTML', context: 'Struktur semantik halaman web.' },
        { name: 'JavaScript', context: 'Interaksi dan perilaku dinamis pada halaman web.' },
        { name: 'Tailwind CSS', context: 'Sistem desain utilitas responsif pada sistem rapor sekolah dan aplikasi POS.' },
        { name: 'Figma', context: 'Wireframe, user flow, dan purwarupa interaktif website klien di PT Metafora.' },
      ],
    },
    backend: {
      label: 'Backend',
      items: [
        { name: 'PHP', context: 'Dasar logika server, manipulasi session, dan arsitektur MVC di tugas akhir dan magang.' },
        { name: 'Laravel', context: 'Autentikasi multi-peran, routing, ORM Eloquent, dan ekspor PDF rapor siswa.' },
        { name: 'CodeIgniter', context: 'Pengembangan modul sistem ERP internal dan perawatan fitur demo perusahaan.' },
      ],
    },
    database: {
      label: 'Database',
      items: [
        { name: 'MySQL', context: 'Perancangan skema relasional, query JOIN, view, dan stored procedure rekap nilai.' },
      ],
    },
    tools: {
      label: 'Tools & Workflow',
      items: [
        { name: 'Git', context: 'Version control, kolaborasi branching, pull request, dan integrasi kode tim.' },
      ],
    },
    soft: {
      label: 'Soft Skill',
      items: [
        { name: 'Manajemen Waktu', context: 'Menyelesaikan modul POS dan tugas akhir tepat waktu sesuai target sprint.' },
        { name: 'Komunikasi & Tim', context: 'Membawakan presentasi hasil ke klien dan bertindak sebagai humas kepanitiaan.' },
        { name: 'Problem Solving', context: 'Mengurai kebutuhan bisnis klien menjadi alur teknis dan struktur data rapi.' },
      ],
    },
  },
  aiWorkflow: {
    lead:
      'Aku memakai OpenCode sebagai AI coding assistant untuk menjaga alur kerja tetap terukur: konteks proyek disiapkan dulu, instruksi ditulis eksplisit, dan hasilnya selalu ditinjau ulang sebelum dipakai.',
    points: [
      {
        title: 'Konteks & rencana',
        desc: 'Kebutuhan fitur dijelaskan lebih dulu, lalu dipecah menjadi langkah kecil yang dapat dikerjakan berurutan.',
      },
      {
        title: 'Eksekusi terarah',
        desc: 'Kode ditulis mengikuti standar proyek yang sudah ada: TypeScript, konvensi folder, dan gaya penulisan yang konsisten.',
      },
      {
        title: 'Review & uji',
        desc: 'Setiap perubahan dicek lewat typecheck, build, dan pengujian visual di browser sebelum menjadi bagian dari hasil akhir.',
      },
    ],
  },
  projects: [
    {
      slug: "sistem-nilai-rapor",
      title: "Sistem Informasi Pengelolaan Nilai dan Rapor",
      role: "Tugas akhir, SMP Santo Borromeus Purbalingga",
      year: "2026",
      summary:
        "Sistem web untuk mengelola nilai dan rapor siswa. Fitur: autentikasi multi peran, pengelolaan data siswa, kelas, mata pelajaran, dan nilai, rekap nilai semester, serta cetak rapor dalam format PDF dengan antarmuka responsif.",
      stack: ["Laravel", "MySQL", "Tailwind CSS"],
      image: "images/projects/Siakad.png",
    },
    {
      slug: "pos-payment-gateway",
      title: "Aplikasi Point of Sale (POS)",
      role: "Magang, PT Metafora Indonesia Teknologi",
      year: "2025",
      summary:
        "Aplikasi kasir berbasis web yang terintegrasi dengan payment gateway, dibangun secara mandiri selama magang.",
      stack: ["Web", "Payment gateway"],
      image: "images/projects/POS.png",
    },
    {
      slug: "erp-system",
      title: "Modul Sistem ERP",
      role: "Magang, PT Metafora Indonesia Teknologi",
      year: "2025",
      summary:
        "Mengembangkan modul sistem ERP dan memelihara fungsionalitas sistem demo perusahaan.",
      stack: [],
      confidential: true, // WAJIB: tanpa gambar apa pun
    },
    {
      slug: "syntaxlab-redesign",
      title: "Redesain Website SyntaxLab",
      role: "Proyek pribadi",
      year: "",
      summary: "Merancang ulang website SyntaxLab sebagai proyek pribadi, dengan fokus pada tampilan halaman utama dan penyajian layanan.",
      stack: [],
      image: "images/projects/SyntaxLab.png",
      imageFit: "contain",
    },
  ] satisfies Project[],
  certificates: [
    {
      slug: "dicoding-javascript",
      title: "Belajar Dasar Pemrograman JavaScript",
      issuer: "Dicoding",
      year: "",
      category: "Pemrograman",
      image: "images/certificates/dicoding-javascript.png",
      pdf: "images/certificates/dicoding-javascript.pdf",
    },
    {
      slug: "dicoding-aws-cloud-genai",
      title: "Belajar Dasar Cloud dan Gen AI di AWS",
      issuer: "Dicoding",
      year: "",
      category: "Cloud",
      image: "images/certificates/dicoding-aws-cloud-genai.png",
      pdf: "images/certificates/dicoding-aws-cloud-genai.pdf",
    },
    {
      slug: "dts-junior-mobile-programmer",
      title: "Junior Mobile Programmer",
      issuer: "Digital Talent Scholarship",
      year: "",
      category: "Pemrograman",
      image: "images/certificates/dts-junior-mobile-programmer.png",
      pdf: "images/certificates/dts-junior-mobile-programmer.pdf",
    },
    {
      slug: "dts-junior-web-developer",
      title: "Junior Web Developer",
      issuer: "Digital Talent Scholarship",
      year: "",
      category: "Pemrograman",
      image: "images/certificates/dts-junior-web-developer.png",
      pdf: "images/certificates/dts-junior-web-developer.pdf",
    },
    {
      slug: "mikrotik-mtcna",
      title: "MikroTik Certified Network Associate (MTCNA)",
      issuer: "MikroTik",
      year: "",
      category: "Jaringan",
      image: "images/certificates/mikrotik-mtcna.png",
      pdf: "images/certificates/mikrotik-mtcna.pdf",
    },
  ] satisfies Certificate[],
  contact: {
    email: "kristiandimasadiwicaksono@gmail.com",
    linkedin: "https://www.linkedin.com/in/kristian-dimas/",
    github: "https://github.com/kristiandimasadiwicaksono",
    phone: "+62 813-2520-6824",
    whatsapp: "https://wa.me/6281325206824",
  },
} as const;