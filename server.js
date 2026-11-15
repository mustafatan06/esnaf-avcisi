const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Genişletilmiş Ankara Esnaf Veritabanı
let comprehensiveDatabase = [
  { id: 1, name: "Anadolu Torna & CNC", category: "oto", district: "Ostim", rating: 3.4, reviews: 8, website: null, phone: "905321112233" },
  { id: 2, name: "İvedik Lazer Kesim", category: "metal", district: "İvedik OSB", rating: 2.8, reviews: 4, website: null, phone: "905353334455" },
  { id: 3, name: "Kuzey Oto Elektrik", category: "oto", district: "Ostim", rating: 3.1, reviews: 5, website: null, phone: "905386667788" },
  { id: 4, name: "Özkan Mobilya İmalat", category: "mobilya", district: "Siteler", rating: 4.8, reviews: 52, website: "https://ozkanmobilya.com", phone: "905332223344" },
  { id: 5, name: "Ata Ahşap Dekorasyon", category: "mobilya", district: "Siteler", rating: 3.5, reviews: 7, website: null, phone: "905347778899" },
  { id: 6, name: "Çankaya Gurme Kafe", category: "kafe", district: "Çankaya", rating: 3.2, reviews: 14, website: null, phone: "905364445566" },
  { id: 7, name: "Altındağ Nakliyat", category: "nakliye", district: "Altındağ", rating: 4.1, reviews: 30, website: "https://altindagnakliyat.com", phone: "905375556677" },
  { id: 8, name: "Mamak Tadilat Dekorasyon", category: "insaat", district: "Mamak", rating: 3.1, reviews: 8, website: null, phone: "905328887766" }
];

// Lead Listeleme ve Dinamik Demo Linki Üretici
app.get('/api/leads', (req, res) => {
  const { district, category, filter } = req.query;
  let results = comprehensiveDatabase;

  if (district && district !== 'all') results = results.filter(item => item.district === district);
  if (category && category !== 'all') results = results.filter(item => item.category === category);

  const processedLeads = results.map(lead => {
    let problems = [];
    if (!lead.website) problems.push("Google Haritalar'da web siteniz bulunmuyor.");
    if (lead.rating < 3.8) problems.push(`Puanınız ${lead.rating} seviyesinde.`);

    const isHotLead = !lead.website || lead.rating < 3.8;
    
    // Vercel'de kusursuz çalışan dinamik rota linki
    const demoLink = `https://tanmedyatasarim.vercel.app/demo/${lead.id}`;

    let pitch = `Merhaba ${lead.name} yetkilisi, Ankara ${lead.district} bölgesindeki işletmenizi Google'da inceledim. ${problems.join(" ")} Sizin için hazırladığımız örnek demo siteyi inceleyebilirsiniz: ${demoLink} - Beğenirseniz 24 saat içinde bu altyapıyı size özel kuralım. Tan Medya Tasarım.`;

    return { ...lead, isHotLead, demoLink, problems: problems.join(" "), pitch };
  });

  let finalLeads = processedLeads;
  if (filter === 'hot') finalLeads = processedLeads.filter(l => l.isHotLead);

  res.json({ total: comprehensiveDatabase.length, filteredCount: finalLeads.length, leads: finalLeads });
});

// Dinamik Sektörel Demo Sayfası (Dosya yazmaya gerek kalmadan anlık render olur)
app.get('/demo/:id', (req, res) => {
  const leadId = parseInt(req.params.id);
  const lead = comprehensiveDatabase.find(l => l.id === leadId);

  const firmaAdi = lead ? lead.name : "Özel İşletme";
  const district = lead ? lead.district : "Ankara";
  const category = lead ? lead.category : "kurumsal";

  res.send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${firmaAdi} - Tan Medya Tasarım Özel Demosu</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col justify-between">
        <div class="bg-indigo-600 text-white text-xs py-2 text-center font-medium px-4 shadow-md">
            🚀 Bu sayfa <span class="underline font-bold">Tan Medya Tasarım</span> tarafından Ankara ${district} bölgesindeki <span class="font-bold">${firmaAdi}</span> için özel tasarlanmıştır.
        </div>
        <header class="max-w-4xl mx-auto px-6 py-12 text-center">
            <span class="px-3 py-1 bg-slate-800 text-indigo-400 border border-slate-700 rounded-full text-xs font-bold uppercase tracking-wider">Özel Sektörel Taslak</span>
            <h1 class="text-4xl md:text-6xl font-extrabold text-white mt-4 tracking-tight">${firmaAdi}</h1>
            <p class="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">Profesyonel dijital altyapı, hızlı mobil web sitesi ve Google Haritalar entegrasyonu.</p>
            <div class="mt-8 flex justify-center space-x-4">
                <a href="#iletisim" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg transition">Hemen Teklif Al</a>
            </div>
        </header>
        <main class="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 w-full">
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div class="text-2xl mb-2">⚡</div>
                <h3 class="font-bold text-white">Hızlı Mobil Uyum</h3>
                <p class="text-sm text-slate-400 mt-2">Müşterilerinizin telefondan saniyeler içinde ulaşabileceği altyapı.</p>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div class="text-2xl mb-2">📍</div>
                <h3 class="font-bold text-white">Google Haritalar Uyumlu</h3>
                <p class="text-sm text-slate-400 mt-2">Harita aramalarında doğrudan dükkanınıza yönlendirme.</p>
            </div>
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div class="text-2xl mb-2">💬</div>
                <h3 class="font-bold text-white">Tek Tıkla WhatsApp</h3>
                <p class="text-sm text-slate-400 mt-2">Müşterinin doğrudan WhatsApp'tan sipariş/fiyat sorması.</p>
            </div>
        </main>
        <footer id="iletisim" class="border-t border-slate-800 bg-slate-900 py-8 text-center text-xs text-slate-500">
            <p>© 2026 ${firmaAdi} | Altyapı: <a href="https://www.tanmedyatasarim.com" class="text-indigo-400 font-semibold hover:underline">Tan Medya Tasarım</a></p>
        </footer>
    </body>
    </html>
  `);
});

// Yerel test için
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Tan Medya Tasarım Motoru aktif: http://localhost:${PORT}`);
  });
}

module.exports = app;