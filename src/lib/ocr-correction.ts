// Indonesian dictionary for OCR post-processing with Levenshtein Distance

const INDONESIAN_WORDS = new Set([
  "dan", "di", "yang", "untuk", "dengan", "ini", "itu", "dari", "pada", "ke",
  "adalah", "akan", "tidak", "sudah", "ada", "bisa", "juga", "lebih", "dalam",
  "atau", "saya", "kami", "kita", "mereka", "dia", "anda", "kamu", "beliau",
  "apa", "siapa", "kapan", "dimana", "mengapa", "bagaimana", "berapa",
  "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh",
  "seratus", "seribu", "sejuta", "pertama", "kedua", "ketiga",
  "besar", "kecil", "tinggi", "rendah", "panjang", "pendek", "lebar", "sempit",
  "baru", "lama", "muda", "tua", "baik", "buruk", "bagus", "jelek",
  "cepat", "lambat", "jauh", "dekat", "banyak", "sedikit",
  "rumah", "sekolah", "kantor", "toko", "pasar", "jalan", "kota", "desa",
  "gedung", "masjid", "gereja", "rumah", "hotel", "restoran", "bank",
  "orang", "anak", "ibu", "ayah", "kakak", "adik", "nenek", "kakek",
  "guru", "murid", "dokter", "polisi", "tentara", "petani", "nelayan",
  "makan", "minum", "tidur", "bangun", "pergi", "datang", "pulang",
  "berjalan", "berlari", "berenang", "terbang", "duduk", "berdiri",
  "membaca", "menulis", "belajar", "mengajar", "bekerja", "bermain",
  "melihat", "mendengar", "berbicara", "bertanya", "menjawab",
  "membeli", "menjual", "membayar", "memberi", "menerima",
  "membuat", "mengambil", "menaruh", "membuka", "menutup",
  "air", "api", "tanah", "angin", "hujan", "panas", "dingin",
  "hari", "minggu", "bulan", "tahun", "pagi", "siang", "sore", "malam",
  "senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu",
  "januari", "februari", "maret", "april", "mei", "juni",
  "juli", "agustus", "september", "oktober", "november", "desember",
  "merah", "biru", "hijau", "kuning", "putih", "hitam", "coklat", "abu",
  "hewan", "kucing", "anjing", "burung", "ikan", "ayam", "sapi", "kambing",
  "makanan", "minuman", "nasi", "roti", "sayur", "buah", "daging", "telur",
  "buku", "pensil", "pulpen", "kertas", "meja", "kursi", "papan", "pintu",
  "mobil", "motor", "sepeda", "bus", "kereta", "pesawat", "kapal",
  "uang", "harga", "murah", "mahal", "gratis", "bayar", "beli", "jual",
  "nama", "alamat", "nomor", "telepon", "email", "surat", "pesan",
  "harus", "boleh", "perlu", "ingin", "mau", "bisa", "dapat", "mampu",
  "sangat", "sekali", "terlalu", "cukup", "hampir", "paling",
  "selalu", "sering", "kadang", "jarang", "pernah", "belum", "masih",
  "sudah", "sedang", "telah", "baru", "segera", "sebentar",
  "semua", "setiap", "beberapa", "banyak", "sedikit", "lain",
  "antara", "tentang", "terhadap", "melalui", "tanpa", "sampai",
  "jika", "kalau", "bila", "ketika", "saat", "sebelum", "sesudah", "setelah",
  "karena", "sebab", "akibat", "oleh", "supaya", "agar", "untuk",
  "tetapi", "namun", "sedangkan", "walaupun", "meskipun",
  "bahwa", "bahkan", "seperti", "sebagai", "menurut",
  "negara", "pemerintah", "rakyat", "bangsa", "dunia", "indonesia",
  "program", "sistem", "proses", "hasil", "data", "informasi",
  "pendidikan", "kesehatan", "ekonomi", "sosial", "budaya", "politik",
  "teknologi", "komputer", "internet", "digital", "aplikasi", "website",
  "terima", "kasih", "maaf", "tolong", "silakan", "permisi",
  "selamat", "datang", "pagi", "siang", "sore", "malam",
  "berita", "kabar", "cerita", "kisah", "dongeng",
  "masalah", "solusi", "jawaban", "pertanyaan", "pendapat",
  "waktu", "tempat", "cara", "alat", "bahan", "bentuk", "warna", "ukuran",
  "utara", "selatan", "timur", "barat", "atas", "bawah", "depan", "belakang",
  "kanan", "kiri", "tengah", "samping", "luar", "dalam",
  "hidup", "mati", "sehat", "sakit", "senang", "sedih", "marah", "takut",
  "cantik", "tampan", "pintar", "bodoh", "rajin", "malas", "kuat", "lemah",
  "benar", "salah", "betul", "keliru", "tepat", "pasti",
  "teman", "sahabat", "musuh", "tetangga", "keluarga",
  "disleksia", "membaca", "menulis", "huruf", "kata", "kalimat", "paragraf",
  "teks", "font", "tulisan", "bacaan", "bahasa", "arti", "makna",
  "kamera", "gambar", "foto", "video", "layar", "tombol",
  "scan", "pindai", "deteksi", "proses", "hasil", "koreksi",
]);

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return ((maxLen - levenshteinDistance(a, b)) / maxLen) * 100;
}

interface CorrectionResult {
  original: string;
  corrected: string;
  corrections: Array<{
    original: string;
    suggested: string;
    similarity: number;
    wasChanged: boolean;
  }>;
}

export function correctOCRText(text: string): CorrectionResult {
  const words = text.split(/(\s+)/);
  const corrections: CorrectionResult["corrections"] = [];
  const correctedWords: string[] = [];

  for (const word of words) {
    if (/^\s+$/.test(word) || word.length < 2) {
      correctedWords.push(word);
      continue;
    }

    const clean = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (clean.length < 2) {
      correctedWords.push(word);
      continue;
    }

    if (INDONESIAN_WORDS.has(clean)) {
      correctedWords.push(word);
      continue;
    }

    let bestMatch = "";
    let bestSim = 0;

    for (const dictWord of INDONESIAN_WORDS) {
      if (Math.abs(dictWord.length - clean.length) > 2) continue;

      const sim = similarity(clean, dictWord);
      if (sim > bestSim) {
        bestSim = sim;
        bestMatch = dictWord;
      }
    }

    if (bestSim < 80) {
      corrections.push({
        original: word,
        suggested: bestMatch || word,
        similarity: bestSim,
        wasChanged: false,
      });
      correctedWords.push(word);
    } else {
      const replaced = preserveCase(word, bestMatch);
      corrections.push({
        original: word,
        suggested: replaced,
        similarity: bestSim,
        wasChanged: true,
      });
      correctedWords.push(replaced);
    }
  }

  return {
    original: text,
    corrected: correctedWords.join(""),
    corrections,
  };
}

function preserveCase(original: string, replacement: string): string {
  if (original === original.toUpperCase()) return replacement.toUpperCase();
  if (original[0] === original[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}
