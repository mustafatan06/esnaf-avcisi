const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gerçekçi Türk esnaf ve işletme havuzu (İl ve sektöre özel detaylı adresler ve telefonlar)
const masterDatabase = [
  // ANKARA - OTO / SANAYİ
  { id: "ankara-oto-1", name: "Özenler Torna & CNC", category: "oto", district: "Ostim OSB 1258. Cad. No:14", rating: 3.4, reviews: 8, website: null, phone: "905321122334" },
  { id: "ankara-oto-2", name: "Kardeşler Oto Mekanik", category: "oto", district: "İvedik OSB 1423. Sok. No:5", rating: 2.9, reviews: 12, website: null, phone: "905332233445" },
  { id: "ankara-oto-3", name: "Güven Rot Balans", category: "oto", district: "Ostim OSB Mah. 1109. Cad.", rating: 4.2, reviews: 25, website: "https://guvenrotbalans.com", phone: "905353344556" },
  { id: "ankara-oto-4", name: "Şimşek Oto Elektrik", category: "oto", district: "Şaşmaz Sanayi Sitesi 2568. Sok.", rating: 3.1, reviews: 6, website: null, phone: "905364455667" },
  { id: "ankara-oto-5", name: "Öz Ankara Kaporta Boya", category: "oto", district: "İvedik OSB Melih Gökçek Bulvarı", rating: 3.6, reviews: 14, website: null, phone: "905375566778" },

  // ANKARA - MOBİLYA / SİTELER
  { id: "ankara-mobilya-1", name: "Ata Ahşap Mobilya İmalat", category: "mobilya", district: "Siteler Girne Cad. No:45", rating: 3.5, reviews: 7, website: null, phone: "905386677889" },
  { id: "ankara-mobilya-2", name: "Gürsoy Koltuk Döşeme", category: "mobilya", district: "Siteler Ertuğrul Gazi Sok. No:12", rating: 3.0, reviews: 9, website: null, phone: "905397788990" },
  { id: "ankara-mobilya-3", name: "Başkent Ofis Mobilyaları", category: "mobilya", district: "Siteler Çınar Cad. No:88", rating: 4.8, reviews: 52, website: "https://baskentofismobilya.com", phone: "905318899001" },
  { id: "ankara-mobilya-4", name: "Yıldız Mutfak & Dolap", category: "mobilya", district: "Siteler Karacakaya Cad. No:3", rating: 2.7, reviews: 4, website: null, phone: "905329900112" },

  // ANKARA - KAFE & RESTORAN
  { id: "ankara-kafe-1", name: "Çankaya Gurme Kafe", category: "kafe", district: "Tunalı Hilmi Cad. No:42/A", rating: 3.2, reviews: 18, website: null, phone: "905330011223" },
  { id: "ankara-kafe-2", name: "Bahçelievler Kahve Evi", category: "kafe", district: "7. Cadde Sokak No:15", rating: 4.6, reviews: 74, website: "https://bahcelikahve.com", phone: "905341122334" },
  { id: "ankara-kafe-3", name: "Esnaf Dürüm & Izgara", category: "kafe", district: "Kızılay Karanfil Sok. No:8", rating: 3.3, reviews: 11, website: null, phone: "905352233445" },

  // İSTANBUL - METAL & TORNA
  { id: "istanbul-metal-1", name: "Marmara Lazer Kesim", category: "metal", district: "İkitelli OSB Demirciler Sanayi Sitesi", rating: 2.8, reviews: 5, website: null, phone: "905363344556" },
  { id: "istanbul-metal-2", name: "Boğaziçi CNC Torna", category: "metal", district: "Dudullu Organize Sanayi Bölgesi", rating: 3.9, reviews: 31, website: "https://bogazicicnc.com", phone: "905374455667" },
  { id: "istanbul-metal-3", name: "Eminönü Paslanmaz Profil", category: "metal", district: "Perpa Ticaret Merkezi A Blok", rating: 3.4, reviews: 16, website: null, phone: "905385566778" },

  // İZMİR - NAKLİYE & İNŞAAT
  { id: "izmir-nakliye-1", name: "Ege Şehir İçi Nakliyat", category: "nakliye", district: "Bornova 4. Sanayi Sitesi", rating: 3.1, reviews: 10, website: null, phone: "905396677889" },
  { id: "izmir-nakliye-2", name: "Körfez Evden Eve Taşımacılık", category: "nakliye", district: "Karabağlar Yeşillik Cad. No:102", rating: 4.1, reviews: 29, website: "https://korfeznakliyat.com", phone: "905317788990" },
  { id: "izmir-insaat-1", name: "Alsancak Tadilat Dekorasyon", category: "insaat", district: "Konak Kıbrıs Şehitleri Cad.", rating: 2.6, reviews: 4, website: null, phone: "905328899001" }
];

// ANA SAYFA (Kurumsal Yüz)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <title>Tan Medya Tasarım | Web Tasarım & Dijital Çözümler</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col justify-between">
        <header class="border-b border-slate-800 bg-slate-900/50 p-4 text-center font-bold text-xl">Tan Medya Tasarım</header>
        <main class="max-w-4xl mx-auto px-6 py-20 text-center">
            <h1 class="text-4xl md:text-6xl font-extrabold text-white">İşletmenizi Dijitalde Zirveye Taşıyın</h1>
            <p class="text-slate-400 mt-4">Profesyonel web tasarımı, e-ticaret ve Google Maps SEO çözümleri.</p>
        </main>
        <footer class="border-t border-slate-800 bg-slate-900 py-6 text-center text-xs text-slate-500">© 2026 Tan Medya Tasarım</footer>
    </body>
    </html>
  `);
});

// YÖNETİCİ PANELİ
app.get('/yonetim-gizli-panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// LİSTELEME VE RASTGELE YENİLEME API'Sİ
app.get('/api/leads', (req, res) => {
  const { il, category, filter } = req.query;

  // Filtreleme yap
  let results = masterDatabase.filter(item => {
    const matchCategory = !category || category === 'all' || item.category === category;
    const matchIl = !il || il === 'all' || item.id.toLowerCase().includes(il.toLowerCase());
    return matchCategory && matchIl;
  });

  // Eğer filtreye uygun az veri kalırsa havuzdan genel karıştırarak çeşitlilik sun
  if (results.length < 3) {
    results = [...masterDatabase].sort(() => 0.5 - Math.random());
  } else {
    // Her istekte (Yenile butonuna basıldığında) sıralamayı karıştır ki sürekli aynı sıra çıkmasın
    results = results.sort(() => 0.5 - Math.random());
  }

  const processedLeads = results.map(lead => {
    let problems = [];
    if (!lead.website) problems.push("Google Haritalar'da web siteniz bulunmuyor.");
    if (lead.rating < 3.8) problems.push(`Puanınız ${lead.rating} seviyesinde.`);

    const isHotLead = !lead.website || lead.rating < 3.8;
    const demoLink = `https://tanmedyatasarim.vercel.app/demo/${lead.id}`;

    let pitch = `Merhaba ${lead.name} yetkilisi, ${lead.district} adresindeki işletmenizi Google'da inceledim. ${problems.join(" ")} Sizin için hazırladığımız örnek demo siteyi inceleyebilirsiniz: ${demoLink} - Beğenirseniz 24 saat içinde bu altyapıyı size özel kuralım. Tan Medya Tasarım.`;

    return { ...lead, isHotLead, demoLink, problems: problems.join(" "), pitch };
  });

  let finalLeads = processedLeads;
  if (filter === 'hot') finalLeads = processedLeads.filter(l => l.isHotLead);

  res.json({ total: masterDatabase.length, filteredCount: finalLeads.length, leads: finalLeads });
});

// OTOMATİK SEKTÖREL ÖRNEK DEMO SİTE
app.get('/demo/:id', (req, res) => {
  const leadId = req.params.id;
  const lead = masterDatabase.find(l => l.id === leadId) || { name: "Özel İşletme", district: "Ankara" };

  res.send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${lead.name} - Tan Medya Tasarım Özel Demosu</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col justify-between">
        <div class="bg-indigo-600 text-white text-xs py-2 text-center font-medium px-4">
            🚀 Bu sayfa <span class="underline font-bold">Tan Medya Tasarım</span> tarafından <span class="font-bold">${lead.name}</span> için özel tasarlanmıştır.
        </div>
        <header class="max-w-4xl mx-auto px-6 py-12 text-center">
            <span class="px-3 py-1 bg-slate-800 text-indigo-400 border border-slate-700 rounded-full text-xs font-bold uppercase">Özel Sektörel Taslak</span>
            <h1 class="text-4xl md:text-6xl font-extrabold text-white mt-4">${lead.name}</h1>
            <p class="text-lg text-slate-400 mt-4">Adres: ${lead.district}</p>
            <div class="mt-8 flex justify-center space-x-4">
                <a href="#iletisim" class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg">Hemen Teklif Al</a>
            </div>
        </header>
        <footer id="iletisim" class="border-t border-slate-800 bg-slate-900 py-8 text-center text-xs text-slate-500">
            <p>© 2026 ${lead.name} | Altyapı: <a href="https://www.tanmedyatasarim.com" class="text-indigo-400 font-semibold underline">Tan Medya Tasarım</a></p>
        </footer>
    </body>
    </html>
  `);
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Aktif: http://localhost:${PORT}`));
}

module.exports = app;