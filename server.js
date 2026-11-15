const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Türkiye'nin 81 ili ve örnek ilçe/sektör veri tabanı üreteci (Derin Tarama Algoritması)
const sektorelIsimler = {
  oto: ["Oto Tamir & Servis", "Mekanik Torna", "Rot Balans", "Oto Elektrik", "Özel Oto Bakım"],
  mobilya: ["Ahşap Mobilya İmalat", "Koltuk Döşeme", "Ofis Mobilyaları", "Özel Tasarım Mobilya", "Ahşap Dekorasyon"],
  metal: ["Lazer Kesim", "CNC Torna", "Metal Profil", "Demir Doğrama", "Endüstriyel Mutfak"],
  kafe: ["Gurme Kafe", "Kahve Diyarı", "Esnaf Lokantası", "Fırın & Pastane", "Fast Food & Dürüm"],
  nakliye: ["Şehir İçi Nakliyat", "Evden Eve Taşımacılık", "Ambar ve Lojistik", "Yük ve Eşya Taşıma"],
  insaat: ["Tadilat & Dekorasyon", "Hafriyat ve Mimarlık", "İnşaat Malzemeleri", "Boyacı & Alçıpan"]
};

// 1. ANA SAYFA: Müşterilerin göreceği profesyonel Tan Medya Tasarım kurumsal yüzü
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tan Medya Tasarım | Ankara Web Tasarım & Dijital Çözümler</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col justify-between">
        <header class="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
            <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <div class="font-extrabold text-xl tracking-tight text-white flex items-center space-x-2">
                    <span class="bg-indigo-600 text-white p-2 rounded-xl">TM</span>
                    <span>Tan Medya Tasarım</span>
                </div>
                <nav class="hidden md:flex space-x-6 text-sm text-slate-300">
                    <a href="#hizmetler" class="hover:text-white transition">Hizmetler</a>
                    <a href="#iletisim" class="hover:text-white transition">İletişim</a>
                </nav>
            </div>
        </header>
        <main class="max-w-6xl mx-auto px-6 py-20 text-center">
            <span class="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold uppercase tracking-wider">Türkiye Geneli Dijital Çözüm Ortağınız</span>
            <h1 class="text-5xl md:text-7xl font-extrabold text-white mt-6 tracking-tight">İşletmenizi Dijitalde<br><span class="text-indigo-500">Zirveye Taşıyın</span></h1>
            <p class="text-lg text-slate-400 mt-6 max-w-2xl mx-auto">Web tasarımı, e-ticaret altyapıları, Google Maps SEO ve özel dijital sistemlerle markanıza değer katıyoruz.</p>
            <div class="mt-10 flex justify-center space-x-4">
                <a href="#iletisim" class="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl shadow-xl transition">Hemen Teklif Al</a>
            </div>
        </main>
        <footer id="iletisim" class="border-t border-slate-800 bg-slate-900 py-12 text-center text-xs text-slate-500">
            <p>© 2026 Tan Medya Tasarım. Tüm hakları saklıdır. Türkiye Geneli</p>
        </footer>
    </body>
    </html>
  `);
});

// 2. GİZLİ YÖNETİM PANELİ
app.get('/yonetim-gizli-panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 3. 81 İL VE DERİN TARAMA API'Sİ
app.get('/api/leads', (req, res) => {
  const { il, category, filter } = req.query;
  const hedefIlara = il || "Ankara";
  const hedefKategori = category || "oto";

  // Derin Tarama Simülasyonu (Seçilen il ve sektöre göre zenginleştirilmiş veri üretir)
  let generatedLeads = [];
  const isimlerListesi = sektorelIsimler[hedefKategori] || sektorelIsimler.oto;

  for (let i = 1; i <= 25; i++) {
    const rastgeleIsimNum = (i * 7) % isimlerListesi.length;
    const firmaAdi = `${hedefIlara} ${i}. ${isimlerListesi[rastgeleIsimNum]}`;
    const rating = (Math.random() * (4.5 - 2.5) + 2.5).toFixed(1);
    const reviews = Math.floor(Math.random() * 35) + 2;
    const hasWebsite = Math.random() > 0.4; // %40 ihtimalle web sitesi var, kalanı fırsat

    generatedLeads.push({
      id: `${hedefIlara}-${hedefKategori}-${i}`,
      name: firmaAdi,
      category: hedefKategori,
      district: `${hedefIlara} Merkez`,
      rating: parseFloat(rating),
      reviews: reviews,
      website: hasWebsite ? `https://${firmaAdi.toLowerCase().replace(/[^a-z0-9]/g, '')}.com` : null,
      phone: `90532${Math.floor(1000000 + Math.random() * 9000000)}`
    });
  }

  const processedLeads = generatedLeads.map(lead => {
    let problems = [];
    if (!lead.website) problems.push("Google Haritalar'da web siteniz bulunmuyor.");
    if (lead.rating < 3.8) problems.push(`Puanınız ${lead.rating} seviyesinde.`);

    const isHotLead = !lead.website || lead.rating < 3.8;
    const demoLink = `https://tanmedyatasarim.vercel.app/demo/${lead.id}`;

    let pitch = `Merhaba ${lead.name} yetkilisi, ${lead.district} bölgesindeki işletmenizi Google'da inceledim. ${problems.join(" ")} Sizin için hazırladığımız örnek demo siteyi inceleyebilirsiniz: ${demoLink} - Beğenirseniz 24 saat içinde bu altyapıyı size özel kuralım. Tan Medya Tasarım.`;

    return { ...lead, isHotLead, demoLink, problems: problems.join(" "), pitch };
  });

  let finalLeads = processedLeads;
  if (filter === 'hot') finalLeads = processedLeads.filter(l => l.isHotLead);

  res.json({ total: generatedLeads.length, filteredCount: finalLeads.length, leads: finalLeads });
});

// 4. MÜŞTERİNİN GÖRECEĞİ SEKTÖREL ÖRNEK DEMO SİTE
app.get('/demo/:id', (req, res) => {
  const leadId = req.params.id;

  res.send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tan Medya Tasarım Özel Demosu</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col justify-between">
        <div class="bg-indigo-600 text-white text-xs py-2 text-center font-medium px-4 shadow-md">
            🚀 Bu sayfa <span class="underline font-bold">Tan Medya Tasarım</span> tarafından işletmeniz için özel tasarlanmıştır.
        </div>
        <header class="max-w-4xl mx-auto px-6 py-12 text-center">
            <span class="px-3 py-1 bg-slate-800 text-indigo-400 border border-slate-700 rounded-full text-xs font-bold uppercase tracking-wider">Özel Sektörel Taslak</span>
            <h1 class="text-4xl md:text-6xl font-extrabold text-white mt-4 tracking-tight">Özel Dijital Çözüm</h1>
            <p class="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">Profesyonel dijital altyapı, hızlı mobil web sitesi ve Google Haritalar entegrasyonu.</p>
            <div class="mt-8 flex justify-center space-x-4">
                <a href="#iletisim" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg transition">Hemen Teklif Al</a>
            </div>
        </header>
        <footer id="iletisim" class="border-t border-slate-800 bg-slate-900 py-8 text-center text-xs text-slate-500">
            <p>© 2026 Tan Medya Tasarım | Altyapı: <a href="https://www.tanmedyatasarim.com" class="text-indigo-400 font-semibold hover:underline">Tan Medya Tasarım</a></p>
        </footer>
    </body>
    </html>
  `);
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Aktif: http://localhost:${PORT}`));
}

module.exports = app;